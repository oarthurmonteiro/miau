defmodule App.Credit do
  @moduledoc """
  The Credit context.
  """

  import Ecto.Query, warn: false
  alias App.Repo
  alias Ecto.Multi

  alias App.Credit.{CreditCard, Invoice}
  alias App.Ledger.Account

  @doc """
  Returns the list of credit_cards.

  ## Examples

      iex> list_credit_cards()
      [%CreditCard{}, ...]

  """
  def list_credit_cards do
    Repo.all(CreditCard)
  end

  @doc """
  Gets a single credit_card.

  Raises if the Credit card does not exist.

  ## Examples

      iex> get_credit_card!(123)
      %CreditCard{}

  """
  def get_credit_card!(id), do: Repo.get!(CreditCard, id)

  @doc """
  Creates a credit_card.

  ## Examples

      iex> create_credit_card(%{field: value})
      {:ok, %CreditCard{}}

      iex> create_credit_card(%{field: bad_value})
      {:error, ...}

  """
  def create_credit_card(attrs) do
    Multi.new()
    # 1. Cria a Conta Virtual primeiro
    |> Multi.insert(:account, fn _changes ->
      Account.changeset(%Account{}, %{
        name: "#{attrs["name"] || attrs[:name]}",
        type: :credit,
        initial_balance: 0,
        current_balance: 0
      })
    end)
    # 2. Cria o Cartão usando o ID da conta gerada acima
    |> Multi.insert(:card, fn %{account: account} ->
      attrs_with_account = Map.put(attrs, "account_id", account.id)
      CreditCard.changeset(%CreditCard{}, attrs_with_account)
    end)
    # 3. Cria a Fatura usando os dados do cartão gerado acima
    |> Multi.run(:invoice, fn repo, %{card: card} ->
      step_insert_invoice(repo, card)
    end)
    |> Repo.transaction()
  end

  defp step_insert_invoice(repo, card, reference_date \\ Date.utc_today()) do
    # O contexto sabe 'o que' fazer (buscar datas e inserir)
    # O schema sabe 'como' calcular essas datas

    # Se hoje for dia 21/01 e o fechamento deste mês foi dia 01/01,
    # precisamos gerar a fatura que vence em Fevereiro (mês 2).

    # Lógica simples: Se hoje > data de fechamento calculada para este mês,
    # pule para o próximo mês.

    dates =
      Invoice.calculate_dates(
        card.due_day,
        reference_date.month,
        reference_date.year,
        card.closing_day_offset
      )

    dates =
      if Date.compare(reference_date, dates.end_date) == :gt do
        # Pula para o próximo ciclo de vencimento
        next_month = Date.shift(reference_date, month: 1)

        Invoice.calculate_dates(
          card.due_day,
          next_month.month,
          next_month.year,
          card.closing_day_offset
        )
      else
        dates
      end

    attrs =
      dates
      |> Map.put(:credit_card_id, card.id)
      |> Map.put(:status, :open)
      |> Map.put(:total_amount, 0)
      |> Map.put(:amount_paid, 0)
      |> Map.put(:remaining_balance, 0)

    %Invoice{}
    |> Invoice.changeset(attrs)
    |> repo.insert()
  end

  @doc """
  Updates a credit_card.

  ## Examples

      iex> update_credit_card(credit_card, %{field: new_value})
      {:ok, %CreditCard{}}

      iex> update_credit_card(credit_card, %{field: bad_value})
      {:error, ...}

  """
  def update_credit_card(%CreditCard{} = credit_card, attrs) do
    credit_card
    |> CreditCard.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a CreditCard.

  ## Examples

      iex> delete_credit_card(credit_card)
      {:ok, %CreditCard{}}

      iex> delete_credit_card(credit_card)
      {:error, ...}

  """
  def delete_credit_card(%CreditCard{} = credit_card) do
    Repo.delete(credit_card)
  end

  @doc """
  Returns a data structure for tracking credit_card changes.

  ## Examples

      iex> change_credit_card(credit_card)
      %Todo{...}

  """
  def change_credit_card(%CreditCard{} = credit_card, attrs \\ %{}) do
    CreditCard.changeset(credit_card, attrs)
  end
end
