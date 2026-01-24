defmodule App.Repo.Migrations.CreateAccounts do
  use Ecto.Migration

  def change do
    # 1. Create the ENUM type for PostgreSQL
    execute "CREATE TYPE account_type AS ENUM ('debit', 'credit')",
          "DROP TYPE account_type"

    create table(:accounts) do
      add :name, :string, size: 32, null: false

      # decimal(10,2) means 10 total digits, 2 after the decimal point
      add :initial_balance, :decimal, precision: 10, scale: 2, default: 0, null: false
      add :current_balance, :decimal, precision: 10, scale: 2, default: 0, null: false

      # Reference the custom enum type
      add :type, :account_type, null: false

      timestamps(type: :utc_datetime)
    end
  end
end
