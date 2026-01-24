defmodule App.Ledger.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "transactions" do
    field(:description, :string)
    field(:amount, :decimal)
    field(:occurred_at, :date)
    field(:type, Ecto.Enum, values: [:income, :expense, :transfer, :refund])

    # Controle de Parcelamento
    field(:total_installments, :integer, default: 1)
    field(:installment_number, :integer)
    field(:parent_transaction_id, :binary_id)

    belongs_to(:account, App.Ledger.Account)
    belongs_to(:category, App.Ledger.Category)

    timestamps(type: :utc_datetime_usec)
  end

  def is_installment?(transaction), do: transaction.total_installments > 1
  def is_installment?(_), do: false

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:description, :amount, :occurred_at, :type, :account_id, :category_id])
    |> validate_length(:description, max: 255)
    |> validate_required([:description, :amount, :occurred_at, :type, :account_id, :category_id])
  end
end
