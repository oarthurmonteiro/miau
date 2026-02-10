defmodule App.Credit.Invoice do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "invoices" do
    field(:start_date, :date)
    field(:end_date, :date)
    field(:due_date, :date)

    field(:total_amount, :decimal)
    field(:amount_paid, :decimal)
    field(:remaining_balance, :decimal)

    field(:status, Ecto.Enum, values: [:open, :future, :closed, :partially_paid, :paid])

    belongs_to(:credit_card, App.Credit.CreditCard)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(invoice, attrs) do
    invoice
    |> cast(attrs, [
      :start_date,
      :end_date,
      :due_date,
      :total_amount,
      :amount_paid,
      :remaining_balance,
      :status,
      :credit_card_id
    ])
    |> validate_required([:start_date, :end_date, :due_date, :status, :credit_card_id])
  end
end
