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

    belongs_to(:account, App.Portfolio.Account)
    belongs_to(:category, App.Ledger.Category)

    has_one(:credit_metadata, App.Ledger.CreditMetadata)

    timestamps(type: :utc_datetime_usec)
  end

  def is_installment?(transaction), do: transaction.total_installments > 1

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:description, :amount, :occurred_at, :type, :account_id, :category_id])
    |> validate_length(:description, max: 255)
    |> validate_required([:description, :amount, :occurred_at, :type, :account_id, :category_id])
  end
end
