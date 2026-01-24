defmodule App.Repo.Migrations.CreateInvoices do
  use Ecto.Migration

  def change do

     execute "CREATE TYPE invoices_status AS ENUM ('open', 'closed', 'partially_paid', 'paid')",
          "DROP TYPE invoices_status"

    create table(:invoices) do

      add :account_id, references(:accounts, on_delete: :nothing), null: false

      add :start_date, :date, null: false
      add :end_date, :date, null: false

      add :total_amount, :decimal, precision: 10, scale: 2, default: 0, null: false
      add :amount_paid, :decimal, precision: 10, scale: 2, default: 0, null: false
      add :remaining_balance, :decimal, precision: 10, scale: 2, default: 0, null: false

      add :status, :invoices_status, null: false

      timestamps(type: :utc_datetime_usec)
    end
  end
end
