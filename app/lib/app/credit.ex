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
      Invoice.changeset(%Invoice{}, generate_invoice_data(card) |> Map.merge(%{status: :open}))
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

  def update_invoice_debt_amount(repo, invoice, amount) do
    new_total = Decimal.add(invoice.total_amount || 0, amount)

    invoice
    |> Invoice.changeset(%{total_amount: new_total, remaining_balance: new_total})
    |> repo.update()
  end

  def generate_invoice_data(card, reference_date \\ Date.utc_today()) do
    reference_date
    |> Cycle.build_for_reference_date(card.due_day, card.closing_day_offset)
    |> Cycle.to_invoice_period()
    |> Map.merge(%{
      credit_card_id: card.id,
      total_amount: 0,
      amount_paid: 0,
      remaining_balance: 0
    })
  end

  def get_or_create_invoice_for_card(repo, credit_card, reference_date) do
    case get_invoice_for_card_by_date(repo, credit_card.id, reference_date) do
      nil ->
        status =
          if open_invoice_exists?(repo, credit_card.id),
            do: :future,
            else: :open

        %Invoice{}
        |> Invoice.changeset(
          generate_invoice_data(credit_card, reference_date)
          |> Map.merge(%{status: status})
        )
        |> repo.insert()

      invoice ->
        {:ok, invoice}
    end
  end

  defp open_invoice_exists?(repo, credit_card_id) do
    from(i in Invoice,
      where: i.credit_card_id == ^credit_card_id and i.status == :open,
      select: 1,
      limit: 1
    )
    |> repo.exists?()
  end

  def get_invoice_for_card_by_date(repo, credit_card_id, date) do
    Invoice
    |> where([i], i.credit_card_id == ^credit_card_id)
    |> where([i], i.start_date <= ^date and i.end_date >= ^date)
    |> order_by([i], asc: i.end_date)
    |> limit(1)
    |> repo.one()
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
