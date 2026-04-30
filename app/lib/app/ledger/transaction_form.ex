defmodule App.Ledger.TransactionForm do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    # Common fields
    field(:type, Ecto.Enum, values: [:income, :expense_debit, :expense_credit, :transfer])
    field(:status, Ecto.Enum, values: [:active, :scheduled])
    field(:occurred_at, :date)
    field(:amount, :decimal)
    field(:description, :string)

    # Specific fields
    field(:category_id, :binary)
    # Used for income/expense
    field(:account_id, :binary)

    # Used for transfer
    field(:source_account_id, :binary)
    # Used for transfer
    field(:destiny_account_id, :binary)
    # Used for expense_credit
    field(:total_installments, :integer)
  end

  def build(params) do
    %__MODULE__{}
    |> changeset(params)
    # We use :insert as a "virtual" action
    |> apply_action(:insert)
  end

  def changeset(struct, params) do
    struct
    |> cast(params, [
      :status,
      :type,
      :description,
      :occurred_at,
      :amount,
      :category_id,
      :account_id,
      :source_account_id,
      :destiny_account_id,
      :total_installments
    ])
    |> validate_required([:type, :occurred_at, :amount])
    |> validate_number(:amount, greater_than: 0)
    |> validate_by_type()
  end

  defp validate_by_type(changeset) do
    case get_field(changeset, :type) do
      :income ->
        validate_income(changeset)

      :expense_debit ->
        validate_expense_debit(changeset)

      :expense_credit ->
        validate_expense_credit(changeset)

      :transfer ->
        validate_transfer(changeset)
    end
  end

  defp validate_income(changeset) do
    changeset
    |> validate_required([:status, :account_id, :description])
    |> validate_length(:description, max: 255)
  end

  defp validate_expense_debit(changeset) do
    changeset
    |> validate_required([:status, :account_id, :description])
    |> validate_length(:description, max: 255)
  end

  defp validate_expense_credit(changeset) do
    changeset
    |> validate_required([:account_id, :description, :total_installments])
    |> validate_length(:description, max: 255)
    |> validate_number(:total_installments, greater_than_or_equal_to: 1, less_than: 400)
  end

  defp validate_transfer(changeset) do
    changeset
    |> validate_required([:source_account_id, :destiny_account_id])
    |> validate_different_accounts()
  end

  defp validate_different_accounts(changeset) do
    src = get_field(changeset, :source_account_id)
    dst = get_field(changeset, :destiny_account_id)

    if src == dst && src != nil,
      do: add_error(changeset, :destiny_account_id, "must be different from source"),
      else: changeset
  end
end
