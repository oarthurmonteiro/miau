defmodule App.Credit.CreditCard do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credit_cards" do
    field :name, :string
    field :limit, :decimal
    field :due_day, :integer

    has_many :invoices, App.Credit.Invoice
    has_many :credit_card_transactions, App.Credit.CreditCardTransaction

    belongs_to :account, App.Ledger.Account

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(credit_card, attrs) do
    credit_card
    |> cast(attrs, [:name, :limit, :due_day, :account_id, :user_id])
    |> validate_required([:name, :limit, :due_day, :account_id, :user_id])
    |> unique_constraint(:account_id) # Garante que uma conta não tenha dois cartões
  end
end
