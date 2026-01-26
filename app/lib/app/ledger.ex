defmodule App.Ledger do
  @moduledoc """
  The Ledger context.
  """

  import Ecto.Query, warn: false
  alias App.Repo

  alias App.Ledger.Category

  @doc """
  Returns the list of categories.

  ## Examples

      iex> list_categories()
      [%Category{}, ...]

  """
  def list_categories do
    Repo.all(Category)
  end

  @doc """
  Gets a single category.

  Raises `Ecto.NoResultsError` if the Category does not exist.

  ## Examples

      iex> get_category!(123)
      %Category{}

      iex> get_category!(456)
      ** (Ecto.NoResultsError)

  """
  def get_category!(id), do: Repo.get!(Category, id)

  @doc """
  Creates a category.

  ## Examples

      iex> create_category(%{field: value})
      {:ok, %Category{}}

      iex> create_category(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_category(attrs) do
    %Category{}
    |> Category.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a category.

  ## Examples

      iex> update_category(category, %{field: new_value})
      {:ok, %Category{}}

      iex> update_category(category, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_category(%Category{} = category, attrs) do
    category
    |> Category.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a category.

  ## Examples

      iex> delete_category(category)
      {:ok, %Category{}}

      iex> delete_category(category)
      {:error, %Ecto.Changeset{}}

  """
  def delete_category(%Category{} = category) do
    Repo.delete(category)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking category changes.

  ## Examples

      iex> change_category(category)
      %Ecto.Changeset{data: %Category{}}

  """
  def change_category(%Category{} = category, attrs \\ %{}) do
    Category.changeset(category, attrs)
  end

  alias App.Ledger.Transaction
  alias App.Ledger.CreditMetadata
  alias App.Portfolio.Account
  alias Ecto.Multi

  @doc """
  Returns the list of transactions.

  ## Examples

      iex> list_transactions()
      [%Transaction{}, ...]

  """
  def list_transactions do
    Repo.all(Transaction)
  end

  @doc """
  Gets a single transaction.

  Raises if the Transaction does not exist.

  ## Examples

      iex> get_transaction!(123)
      %Transaction{}

  """
  def get_transaction!(id), do: Repo.get!(Transaction, id)

  @doc """
  Creates a transaction.
  Cria uma transação e atualiza o saldo da conta de forma atômica.
  ## Examples

      iex> create_transaction(%{field: value})
      {:ok, %Transaction{}}

      iex> create_transaction(%{field: bad_value})
      {:error, ...}

  """

  def create_transaction(attrs \\ %{}) do
    Multi.new()
    |> Multi.insert(:transaction, Transaction.changeset(%Transaction{}, attrs))
    |> Multi.run(:account, fn repo, %{transaction: t} ->
      # Buscamos a conta dentro do Multi para garantir o lock do banco
      fetch_account(repo, t.account_id)
    end)
    |> Multi.run(:credit_metadata, fn repo, %{transaction: t, account: a} ->
      Credit.maybe_attach_transaction(repo, t, a, attrs)
    end)
    |> Multi.update(:updated_account, fn %{transaction: t, account: a} ->
      # Lógica de cálculo delegada ao Schema ou função privada
      new_balance = calculate_new_balance(a.current_balance, t.amount, t.type)
      Account.changeset(a, %{current_balance: new_balance})
    end)
    |> Repo.transaction()
  end

  # Funções auxiliares privadas para manter o Multi limpo
  defp fetch_account(repo, id) do
    case repo.get(Account, id) |> repo.preload(:credit_card) do
      nil -> {:error, :account_not_found}
      account -> {:ok, account}
    end
  end

  # Se a conta for do tipo :credit, injetamos o Multi.insert
  defp maybe_insert_transaction_metadata(multi, attrs) do
    multi
    |> Multi.run(:metadata, fn repo, %{transaction: t, account: a} ->
      case a.type do
        :credit ->
          # Aqui você chamaria seu ensure_invoice_exists
          invoice = ensure_invoice_exists(repo, a, t.occurred_at)

          metadata_attrs =
            attrs
            |> Map.get("credit_metadata", %{})
            |> Map.merge(%{
              "transaction_id" => t.id,
              "invoice_id" => invoice.id
            })

          repo.insert(CreditMetadata.changeset(%CreditMetadata{}, metadata_attrs))

        _other_type ->
          # Se for débito/dinheiro, não faz nada e retorna OK
          {:ok, nil}
      end
    end)
  end

  defp get_invoice_by_date(repo, credit_card_id, date) do
    App.Credit.Invoice
    |> where([i], i.credit_card_id == ^credit_card_id)
    # "Aonde a fatura termina depois da data X"
    |> where([i], i.end_date >= ^date)
    # Pega a mais próxima do futuro
    |> order_by([i], asc: i.end_date)
    # Garante que só vem uma
    |> limit(1)
    # Executa a query
    |> repo.one()
  end

  def create_installment_purchase(attrs \\ %{}) do
    total_installments = String.to_integer(attrs["total_installments"] || "1")

    Multi.new()
    # 1. Buscamos a conta primeiro para validar se é crédito
    |> Multi.run(:account, fn repo, _ ->
      case repo.get(Account, attrs["account_id"]) |> repo.preload(:credit_card) do
        %Account{type: :credit} = a -> {:ok, a}
        _ -> {:error, :not_a_credit_account}
      end
    end)
    # 2. Geramos as N parcelas dinamicamente
    |> insert_installments(attrs, total_installments)
    # 3. Atualizamos o saldo da conta (valor total da compra)
    |> Multi.update(:updated_account, fn %{account: a} ->
      new_balance = Decimal.add(a.current_balance, attrs["amount"])
      Account.changeset(a, %{current_balance: new_balance})
    end)
    |> Repo.transaction()
  end

  # --- Helpers para gerar as parcelas ---

  defp insert_installments(multi, attrs, total) do
    # Convertemos a data uma única vez fora do loop para performance
    base_date = Date.from_iso8601!(attrs["occurred_at"])

    Enum.reduce(1..total, multi, fn i, acc_multi ->
      t_key = String.to_atom("t_#{i}")
      m_key = String.to_atom("m_#{i}")

      # Calculamos o deslocamento: Parcela 1 = +0 meses, Parcela 2 = +1 mês...
      installment_date = Date.shift(base_date, month: i - 1)

      acc_multi
      |> Multi.insert(t_key, fn _ ->
        Transaction.changeset(%Transaction{}, %{attrs | "occurred_at" => installment_date})
      end)
      # 'results' contém todas as operações anteriores
      |> Multi.run(m_key, fn repo, results ->
        t = Map.fetch!(results, t_key)
        a = Map.fetch!(results, :account)

        # Buscamos o ID da primeira parcela para ser o pai (parent)
        parent_id = if i > 1, do: Map.fetch!(results, :t_1).id, else: nil

        invoice = ensure_invoice_exists(repo, a, installment_date)

        metadata_attrs = %{
          "transaction_id" => t.id,
          "invoice_id" => invoice.id,
          "installment_number" => i,
          "total_installments" => total,
          "parent_transaction_id" => parent_id
        }

        repo.insert(CreditMetadata.changeset(%CreditMetadata{}, metadata_attrs))
      end)
    end)
  end

  defp calculate_new_balance(current, amount, :income), do: Decimal.add(current, amount)
  defp calculate_new_balance(current, amount, :expense), do: Decimal.sub(current, amount)
  defp calculate_new_balance(current, _amount, _), do: current

  @doc """
  Updates a transaction.

  ## Examples

      iex> update_transaction(transaction, %{field: new_value})
      {:ok, %Transaction{}}

      iex> update_transaction(transaction, %{field: bad_value})
      {:error, ...}

  """
  def update_transaction(%Transaction{} = transaction, attrs) do
    transaction
    |> Transaction.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Transaction.

  ## Examples

      iex> delete_transaction(transaction)
      {:ok, %Transaction{}}

      iex> delete_transaction(transaction)
      {:error, ...}

  """
  def delete_transaction(%Transaction{} = transaction) do
    Repo.delete(transaction)
  end

  @doc """
  Returns a data structure for tracking transaction changes.

  ## Examples

      iex> change_transaction(transaction)
      %Todo{...}

  """
  def change_transaction(%Transaction{} = transaction, attrs \\ %{}) do
    Transaction.changeset(transaction, attrs)
  end

  alias App.Ledger.CreditMetadata

  @doc """
  Returns the list of credit_metadata.

  ## Examples

      iex> list_credit_metadata()
      [%CreditMetadata{}, ...]

  """
  def list_credit_metadata do
    Repo.all(CreditMetadata)
  end

  @doc """
  Gets a single credit_metadata.

  Raises `Ecto.NoResultsError` if the Credit metadata does not exist.

  ## Examples

      iex> get_credit_metadata!(123)
      %CreditMetadata{}

      iex> get_credit_metadata!(456)
      ** (Ecto.NoResultsError)

  """
  def get_credit_metadata!(id), do: Repo.get!(CreditMetadata, id)

  @doc """
  Creates a credit_metadata.

  ## Examples

      iex> create_credit_metadata(%{field: value})
      {:ok, %CreditMetadata{}}

      iex> create_credit_metadata(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_credit_metadata(attrs) do
    %CreditMetadata{}
    |> CreditMetadata.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a credit_metadata.

  ## Examples

      iex> update_credit_metadata(credit_metadata, %{field: new_value})
      {:ok, %CreditMetadata{}}

      iex> update_credit_metadata(credit_metadata, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_credit_metadata(%CreditMetadata{} = credit_metadata, attrs) do
    credit_metadata
    |> CreditMetadata.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a credit_metadata.

  ## Examples

      iex> delete_credit_metadata(credit_metadata)
      {:ok, %CreditMetadata{}}

      iex> delete_credit_metadata(credit_metadata)
      {:error, %Ecto.Changeset{}}

  """
  def delete_credit_metadata(%CreditMetadata{} = credit_metadata) do
    Repo.delete(credit_metadata)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking credit_metadata changes.

  ## Examples

      iex> change_credit_metadata(credit_metadata)
      %Ecto.Changeset{data: %CreditMetadata{}}

  """
  def change_credit_metadata(%CreditMetadata{} = credit_metadata, attrs \\ %{}) do
    CreditMetadata.changeset(credit_metadata, attrs)
  end
end
