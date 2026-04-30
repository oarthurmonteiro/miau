defmodule App.Credit.InstallmentTest do
  use ExUnit.Case, async: true
  alias App.Credit.Installment

  test "build_plan/1 creates correct number of installments and amounts" do
    attrs = %{
      amount: Decimal.new("300.00"),
      occurred_at: ~D[2026-01-01],
      total_installments: 3,
      description: "Ilhabela Jeep Ride"
    }

    plan = Installment.build_plan(attrs)

    assert plan.total == 3
    assert Decimal.equal?(plan.amount_per_installments, Decimal.new("100.00"))

    [first, second, third] = plan.installments
    assert first.occurred_at == ~D[2026-01-01]
    assert second.occurred_at == ~D[2026-02-01]
    assert third.description == "Ilhabela Jeep Ride (3/3)"
  end
end
