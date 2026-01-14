defmodule App.Ledger.Account do
  use Ecto.Schema
  import Ecto.Changeset

  schema "accounts" do
    field :name, :string
    field :initial_balance, :decimal
    field :current_balance, :decimal
    field :type, Ecto.Enum, values: [:user, :virtual] # Maps atoms to DB strings

    has_many :transaction, App.Ledger.Transaction
    has_many :balance_histories, App.Ledger.BalanceHistory

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(account, attrs) do
    account
    |> cast(attrs, [:name, :initial_balance, :current_balance, :type])
    |> validate_length(:name, max: 16)
    |> validate_required([:name])
  end
end
