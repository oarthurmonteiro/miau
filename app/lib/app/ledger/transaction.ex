defmodule App.Ledger.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "transactions" do

    field :description, :string
    field :amount, :decimal
    field :occurred_at, :date
    field :type, Ecto.Enum, values: [:income, :expense, :transfer] # Maps atoms to DB strings

    belongs_to :account, App.Ledger.Account
    belongs_to :category, App.Ledger.Category

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:description, :amount, :occurred_at, :type])
    |> validate_required([])
  end
end
