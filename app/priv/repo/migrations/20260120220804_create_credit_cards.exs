defmodule App.Repo.Migrations.CreateCreditCards do
  use Ecto.Migration

  def change do
    create table(:credit_cards) do
      add :limit, :decimal, precision: 10, scale: 2, default: 0, null: false
      add :due_day, :smallint
      add :closing_day_offset, :smallint
      add :account_id, references(:accounts, on_delete: :restrict), null: false

      timestamps(type: :utc_datetime_usec)
    end
  end
end
