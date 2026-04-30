defmodule App.Repo.Migrations.CreateBalanceHistory do
  use Ecto.Migration

  def change do
    create table(:balance_history) do

      add :account_id, references(:accounts, on_delete: :nothing), null: false
      add :balance, :decimal, precision: 10, scale: 2, default: 0, null: false

      timestamps(updated_at: false)

    end
  end
end
