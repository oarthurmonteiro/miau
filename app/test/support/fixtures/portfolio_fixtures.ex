defmodule App.PortfolioFixtures do
  @moduledoc """
  Helpers for creating data in the Portfolio domain.
  """

  def account_fixture(attrs \\ %{}) do
    {:ok, account} =
      attrs
      |> Enum.into(%{
        name: "Account #{System.unique_integer()}",
        type: :debit,
        initial_balance: Decimal.new("1000"),
        current_balance: Decimal.new("1000")
      })
      |> App.Portfolio.create_account()

    account
  end
end
