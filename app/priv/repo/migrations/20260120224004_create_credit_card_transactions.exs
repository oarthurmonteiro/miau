defmodule App.Repo.Migrations.CreateCreditCardTransactions do
  use Ecto.Migration

  def change do
    create table(:credit_card_transactions) do

      add :transaction_id, references(:transactions, on_delete: :nothing), null: false
      add :credit_card_id, references(:credit_cards, on_delete: :nothing), null: false
      add :invoice_id, references(:invoices, on_delete: :nothing), null: false

      add :installment_number, :smallint
      add :total_installments, :smallint

      timestamps(type: :utc_datetime_usec)
    end
  end
end
