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
  alias App.Ledger.TransactionForm
  alias App.Ledger.CreditMetadata
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
  def create_transaction(attrs) do
    with {:ok, form_data} <- TransactionForm.build(attrs),
         do: do_create_transaction(form_data)
  end

  defp do_create_transaction(%TransactionForm{:type => :income} = _attrs), do: raise("TO DO")

  defp do_create_transaction(%TransactionForm{:type => :expense_debit} = _attrs),
    do: raise("TO DO")

  defp do_create_transaction(%TransactionForm{:type => :expense_credit} = attrs) do
    Multi.new()
    |> Multi.run(:account, fn repo, _ ->
      App.Portfolio.fetch_account_with_credit(repo, attrs.account_id)
    end)
    |> Multi.run(:plan, fn _repo, _ ->
      {:ok, App.Credit.Installment.build_plan(attrs)}
    end)
    |> Multi.merge(fn %{plan: plan, account: a} ->
      insert_installments_multi(plan, a, attrs)
    end)
    |> Multi.run(:balance, fn repo, %{account: a} ->
      new_balance = a.current_balance |> Decimal.add(attrs.amount)

      App.Portfolio.update_account_balance(repo, a, new_balance)
    end)
    |> Repo.transaction()
  end

  defp do_create_transaction(%TransactionForm{:type => :transfer} = _attrs), do: raise("TO DO")

  defp insert_installments_multi(plan, account, attrs) do
    Enum.reduce(plan.installments, Multi.new(), fn inst, multi ->
      tx_key = {:tx, inst.installment_number}
      invoice_key = {:invoice, inst.installment_number}
      meta_key = {:metadata, inst.installment_number}

      multi
      |> Multi.insert(tx_key, fn _ ->
        Transaction.changeset(
          %Transaction{},
          %{
            description: attrs.description,
            category_id: attrs.category_id,
            account_id: attrs.account_id,
            amount: inst.amount,
            occurred_at: inst.occurred_at,
            type: :expense
          }
        )
      end)
      |> Multi.run(invoice_key, fn repo, results ->
        tx = results[tx_key]

        with {:ok, invoice} <-
               App.Credit.get_or_create_invoice_for_card(
                 repo,
                 account.credit_card,
                 tx.occurred_at
               ),
             {:ok, updated_invoice} <-
               App.Credit.update_invoice_debt_amount(repo, invoice, tx.amount) do
          {:ok, updated_invoice}
        else
          {:error, reason} -> {:error, reason}
        end
      end)
      |> Multi.run(meta_key, fn repo, results ->
        tx = results[tx_key]
        invoice = results[invoice_key]

        CreditMetadata.changeset(%CreditMetadata{}, %{
          installment_number: inst.installment_number,
          total_installments: inst.total_installments,
          transaction_id: tx.id,
          invoice_id: invoice.id,
          parent_transaction_id:
            if(inst.installment_number == 1,
              do: nil,
              else: results[{:tx, 1}].id
            )
        })
        |> repo.insert()
      end)
    end)
  end

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
