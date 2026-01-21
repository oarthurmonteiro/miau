defmodule App.LedgerFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Ledger` context.
  """

  @doc """
  Generate a category.
  """
  def category_fixture(attrs \\ %{}) do
    {:ok, category} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> App.Ledger.create_category()

    category
  end

  @doc """
  Generate a account.
  """
  def account_fixture(attrs \\ %{}) do
    {:ok, account} =
      attrs
      |> Enum.into(%{
        current_balance: "120.5",
        initial_balance: "120.5",
        name: "some name"
      })
      |> App.Ledger.create_account()

    account
  end

  @doc """
  Generate a transaction.
  """
  def transaction_fixture(attrs \\ %{}) do
    {:ok, transaction} =
      attrs
      |> Enum.into(%{
        amount: "120.5",
        description: "some description",
        occurred_at: ~D[2026-01-20],
        type: :income
      })
      |> App.Ledger.create_transaction()

    transaction
  end
end
