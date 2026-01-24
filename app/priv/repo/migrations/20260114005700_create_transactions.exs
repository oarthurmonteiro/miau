defmodule App.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    execute "CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer', 'refund')",
          "DROP TYPE transaction_type"

    create table(:transactions) do

      add :account_id, references(:accounts, on_delete: :nothing), null: false
      add :category_id, references(:categories, on_delete: :nothing), null: false
      add :amount, :decimal, precision: 10, scale: 2, default: 0, null: false
      add :type, :transaction_type, null: false
      add :occurred_at, :date, null: false
      add :description, :string, null: false

      # Controle de Parcelamento
      add :total_installments, :smallint, default: 1
      add :installment_number, :smallint
      add :parent_transaction_id, references(:transactions, on_delete: :nothing)

      timestamps(type: :utc_datetime_usec)
    end
  end
end
