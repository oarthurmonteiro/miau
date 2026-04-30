defmodule App.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    execute "CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer', 'refund')",
          "DROP TYPE transaction_type"

    execute "CREATE TYPE transaction_status AS ENUM ('active', 'scheduled', 'refunded')",
        "DROP TYPE transaction_status"

    create table(:transactions) do

      add :account_id, references(:accounts, on_delete: :nothing), null: false
      add :category_id, references(:categories, on_delete: :nothing)
      add :amount, :decimal, precision: 10, scale: 2, null: false
      add :type, :transaction_type, null: false
      add :status, :transaction_status, null: false
      add :occurred_at, :date, null: false
      add :description, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end
  end
end
