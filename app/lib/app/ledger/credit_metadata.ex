defmodule App.Ledger.CreditMetadata do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credit_metadata" do

    field :total_installments, :integer
    field :installment_number, :integer

    field :parent_transaction_id, :binary_id
    field :transaction_id, :binary_id
    field :invoice_id, :binary_id

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(credit_metadata, attrs) do
    credit_metadata
    |> cast(attrs, [:total_installments, :installment_number])
    |> validate_required([:total_installments, :installment_number])
  end
end
