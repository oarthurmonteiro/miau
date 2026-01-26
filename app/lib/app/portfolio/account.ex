defmodule App.Portfolio.Account do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "accounts" do
    field(:name, :string)
    field(:initial_balance, :decimal)
    field(:current_balance, :decimal)
    field(:type, Ecto.Enum, values: [:debit, :credit])

    has_many(:transactions, App.Ledger.Transaction)
    has_many(:balance_history, App.Portfolio.BalanceHistory)

    has_one(:credit_card, App.Credit.CreditCard)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(account, attrs) do
    account
    |> cast(attrs, [:name, :initial_balance, :current_balance, :type])
    |> validate_length(:name, max: 32)
    |> validate_required([:name, :initial_balance])
    # Chamada da função auxiliar
    |> maybe_sync_current_balance()
  end

  defp maybe_sync_current_balance(%{data: %{id: nil}} = changeset) do
    # Se o ID é nil, a conta é nova. Sincronizamos.
    initial = get_field(changeset, :initial_balance)
    put_change(changeset, :current_balance, initial)
  end

  # Se a conta já existe (tem ID), não tocamos no saldo atual.
  defp maybe_sync_current_balance(changeset), do: changeset
end
