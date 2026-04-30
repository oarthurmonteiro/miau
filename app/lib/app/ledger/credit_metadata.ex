defmodule App.Ledger.CreditMetadata do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credit_metadata" do
    field(:total_installments, :integer)
    field(:installment_number, :integer)

    belongs_to(:parent_transaction, App.Ledger.Transaction)
    belongs_to(:transaction, App.Ledger.Transaction)
    belongs_to(:invoice, App.Credit.Invoice)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(credit_metadata, attrs) do
    credit_metadata
    |> cast(attrs, [
      :total_installments,
      :installment_number,
      :parent_transaction_id,
      :transaction_id,
      :invoice_id
    ])
    |> validate_required([:total_installments, :installment_number, :transaction_id, :invoice_id])
  end

  def installment_link_changeset(tx_id, invoice_id, inst, parent_id \\ nil) do
    %__MODULE__{}
    |> changeset(%{
      transaction_id: tx_id,
      invoice_id: invoice_id,
      installment_number: inst.installment_number,
      total_installments: inst.total_installments,
      parent_transaction_id: parent_id
    })
  end
end
