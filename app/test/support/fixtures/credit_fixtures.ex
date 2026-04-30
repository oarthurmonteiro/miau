defmodule App.CreditFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Credit` context.
  """

  @doc """
  Generate a credit_card.
  """
  def credit_card_fixture(attrs \\ %{}) do
    {:ok, %{card: credit_card, account: account}} =
      attrs
      |> Enum.into(%{
        due_day: 10,
        limit: Decimal.new("5000.00"),
        closing_day_offset: 7,
        name: "some name"
      })
      |> App.Credit.create_credit_card()

    credit_card |> Map.put(:account, account)
  end

  def invoice_fixture(attrs \\ %{}) do
    card_id = attrs[:credit_card_id] || credit_card_fixture().id

    {:ok, invoice} =
      attrs
      |> Enum.into(%{
        start_date: ~D[2026-04-01],
        end_date: ~D[2026-04-30],
        due_date: ~D[2026-05-10],
        status: :open,
        total_amount: Decimal.new("0.00"),
        credit_card_id: card_id
      })
      |> App.Credit.create_invoice()

    invoice
  end
end
