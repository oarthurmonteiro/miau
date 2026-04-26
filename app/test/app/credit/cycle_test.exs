defmodule App.Credit.CycleTest do
  use ExUnit.Case, async: true
  alias App.Credit.Cycle

  test "build_for_reference_date/3 calculates correct dates for a standard month" do
    reference_date = ~D[2026-04-10]
    # Closing is 10 days before the due day (20th)
    cycle = Cycle.build_for_reference_date(reference_date, 20, 10)

    assert cycle.due_date == ~D[2026-04-20]
    # 20 - 10 days
    assert cycle.end_date == ~D[2026-04-10]
    assert cycle.start_date == ~D[2026-03-11]
  end

  test "shift_if_needed/2 pushes to next month if reference is after closing" do
    # Reference is April 11th, but cycle closed on April 10th
    reference_date = ~D[2026-04-11]
    cycle = Cycle.build_for_reference_date(reference_date, 20, 10)

    # It should shift to the May cycle
    assert cycle.due_date == ~D[2026-05-20]
  end
end
