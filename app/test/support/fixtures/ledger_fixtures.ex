defmodule App.LedgerFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Ledger` context.
  """

  import App.PortfolioFixtures

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
  Generate a transaction.
  """
  def transaction_fixture(attrs \\ %{}) do
    account_id = attrs[:account_id] || account_fixture().id
    category_id = attrs[:category_id] || category_fixture().id

    {:ok, transaction} =
      attrs
      |> Enum.into(%{
        amount: "120.5",
        description: "some description",
        occurred_at: ~D[2026-01-20],
        type: :income,
        status: :active,
        category_id: category_id,
        account_id: account_id
      })
      |> App.Ledger.create_transaction()

    transaction
  end

  @doc """
  Generate a credit_metadata.
  """
  def credit_metadata_fixture(attrs \\ %{}) do
    {:ok, credit_metadata} =
      attrs
      |> Enum.into(%{
        installment_number: 42,
        total_installments: 42
      })
      |> App.Ledger.create_credit_metadata()

    credit_metadata
  end
end
