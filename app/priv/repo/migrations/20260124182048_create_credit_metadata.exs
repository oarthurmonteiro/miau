defmodule App.Repo.Migrations.CreateCreditMetadata do
  use Ecto.Migration

  def change do
    create table(:credit_metadata) do

      add :total_installments, :smallint
      add :installment_number, :smallint

      add :parent_transaction_id, references(:transactions, on_delete: :nothing, type: :binary_id)
      add :transaction_id, references(:transactions, on_delete: :nothing, type: :binary_id)
      add :invoice_id, references(:invoices, on_delete: :nothing, type: :binary_id)

      timestamps(type: :utc_datetime_usec)
    end

    create index(:credit_metadata, [:parent_transaction_id])
    create index(:credit_metadata, [:transaction_id])
    create index(:credit_metadata, [:invoice_id])
  end
end
