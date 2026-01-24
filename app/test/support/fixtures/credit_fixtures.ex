defmodule App.CreditFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Credit` context.
  """

  @doc """
  Generate a credit_card.
  """
  def credit_card_fixture(attrs \\ %{}) do
    {:ok, credit_card} =
      attrs
      |> Enum.into(%{
        due_day: 42,
        limit: "120.5",
        name: "some name"
      })
      |> App.Credit.create_credit_card()

    credit_card
  end
end
