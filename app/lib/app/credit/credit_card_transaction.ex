defmodule App.Credit.CreditCardTransaction do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credit_card_transactions" do

    field :installment_number, :integer
    field :total_installments, :integer

    belongs_to :credit_card, App.Credit.CreditCard
    belongs_to :invoice, App.Credit.Invoice
    belongs_to :transaction, App.Ledger.Transaction

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(credit_card_transaction, attrs) do
    credit_card_transaction
    |> cast(attrs, [])
    |> validate_required([])
  end
end
