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
    field(:status, Ecto.Enum, values: [:active, :scheduled, :refunded])

    belongs_to(:account, App.Portfolio.Account)
    belongs_to(:category, App.Ledger.Category)

    has_one(:credit_metadata, App.Ledger.CreditMetadata)

    timestamps(type: :utc_datetime_usec)
  end

  def is_installment?(transaction), do: transaction.total_installments > 1

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:status, :description, :amount, :occurred_at, :type, :account_id, :category_id])
    |> validate_length(:description, max: 255)
    |> validate_required([:status, :description, :amount, :occurred_at, :type, :account_id, :category_id])
  end

  def credit_changeset(form_attrs, installment) do
    %__MODULE__{}
    |> changeset(%{
      description: form_attrs.description,
      category_id: form_attrs.category_id,
      account_id: form_attrs.account_id,
      amount: installment.amount,
      occurred_at: installment.occurred_at,
      status: credit_status(installment),
      type: :expense
    })
  end

  defp credit_status(%{installment_number: 1}), do: :active
  defp credit_status(_), do: :scheduled
end
