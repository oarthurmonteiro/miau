defmodule App.Credit.CreditCard do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credit_cards" do
    field :limit, :decimal
    field :due_day, :integer
    field :closing_day_offset, :integer

    belongs_to :account, App.Portfolio.Account

    has_many(:invoices, App.Credit.Invoice)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(credit_card, attrs) do
    credit_card
    |> cast(attrs, [:limit, :due_day, :account_id, :closing_day_offset])
    |> validate_required([:limit, :due_day, :account_id, :closing_day_offset])
    |> validate_number(:due_day, [greater_than_or_equal_to: 1, less_than_or_equal_to: 31])
    |> validate_number(:closing_day_offset, [greater_than_or_equal_to: 1, less_than_or_equal_to: 15])
    |> unique_constraint(:account_id) # Garante que uma conta não tenha dois cartões
  end
end
