defmodule App.Credit do
  @moduledoc """
  The Credit context.
  """

  import Ecto.Query, warn: false
  alias App.Repo
  alias Ecto.Multi

  alias App.Credit.{CreditCard, Invoice, Cycle}
  alias App.Portfolio.Account

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
    |> create_virtual_account(attrs)
    |> create_card(attrs)
    |> create_initial_invoice()
    |> Repo.transaction()
  end

  defp create_virtual_account(multi, attrs) do
    Multi.insert(multi, :account, build_credit_account_changeset(attrs))
  end

  defp create_card(multi, attrs) do
    Multi.insert(multi, :card, fn %{account: account} ->
      account
      |> Ecto.build_assoc(:credit_card)
      |> CreditCard.changeset(attrs)
    end)
  end

  defp create_initial_invoice(multi) do
    Multi.insert(multi, :invoice, fn %{card: card} ->
      card
      |> generate_invoice_data()
      |> Invoice.changeset()
    end)
  end

  defp build_credit_account_changeset(attrs) do
    Account.changeset(%Account{}, %{
      name: Map.get(attrs, "name") || Map.get(attrs, :name),
      type: :credit,
      initial_balance: 0,
      current_balance: 0
    })
  end

  def generate_invoice_data(card, reference_date \\ Date.utc_today()) do
    reference_date
    |> due_date_for(card)
    |> Cycle.from_due_date(card.closing_day_offset)
    |> maybe_shift_cycle(reference_date, card)
    |> Map.merge(%{
      account_id: card.account_id,
      status: :open,
      total_amount: 0,
      amount_paid: 0,
      remaining_balance: 0
    })
  end

  defp due_date_for(reference_date, card) do
    Date.new!(reference_date.year, reference_date.month, card.due_day)
  end

  defp maybe_shift_cycle(dates, reference_date, card) do
    if after_closing?(reference_date, dates) do
      next_cycle(reference_date, card)
    else
      dates
    end
  end

  defp after_closing?(reference_date, %{end_date: end_date}) do
    Date.after?(reference_date, end_date)
  end

  defp next_cycle(reference_date, card) do
    reference_date
    |> Date.shift(month: 1)
    |> Date.beginning_of_month()
    |> Date.add(card.due_day - 1)
    |> Cycle.from_due_date(card.closing_day_offset)
  end

  def maybe_attach_transaction(repo, transaction, account, attrs) do
    case account.type do
      :credit -> attach_credit_transaction(repo, transaction, account, attrs)
      _ -> {:ok, nil}
    end
  end

  def attach_credit_transaction(repo, transaction, account, attrs) do
    card = account.credit_card

    invoice =
      transaction.occurred_at
      |> Date.from_naive!()
      |> Invoice.Cycle.ensure_invoice(repo, card)

    metadata_attrs =
      attrs
      |> Map.get("credit_metadata", %{})
      |> Map.merge(%{
        "transaction_id" => transaction.id,
        "invoice_id" => invoice.id
      })

    repo.insert(CreditMetadata.changeset(%CreditMetadata{}, metadata_attrs))
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
