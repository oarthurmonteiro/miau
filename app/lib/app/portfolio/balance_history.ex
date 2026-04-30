defmodule App.Portfolio.BalanceHistory do
  use Ecto.Schema
  import Ecto.Changeset

  schema "balance_history" do
    field(:balance, :decimal)
    belongs_to(:account, App.Portfolio.Account)

    # O Ecto gerenciará o inserted_at automaticamente no Repo.insert
    timestamps(updated_at: false)
  end

  @doc false
  def changeset(balance_history, attrs) do
    balance_history
    |> cast(attrs, [:balance, :account_id])
    |> validate_required([:balance, :account_id])
  end
end
