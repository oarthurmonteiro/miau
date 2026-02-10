defmodule App.Credit.Cycle do
  defstruct [
    :due_date,
    :start_date,
    :end_date,
    :due_day,
    :closing_offset
  ]

  @type t :: %__MODULE__{
          due_date: Date.t(),
          start_date: Date.t(),
          end_date: Date.t(),
          due_day: pos_integer(),
          closing_offset: non_neg_integer()
        }

  @spec build_for_reference_date(Date.t(), non_neg_integer(), non_neg_integer()) :: t()
  def build_for_reference_date(reference_date, due_day, closing_offset) do
    reference_date
    |> due_date_for(due_day)
    |> from_due_date(due_day, closing_offset)
    |> shift_if_needed(reference_date)
  end

  defp from_due_date(due_date, due_day, closing_offset) do
    %__MODULE__{
      due_date: due_date,
      due_day: due_day,
      closing_offset: closing_offset,
      end_date: closing_date_from_due(due_date, closing_offset),
      start_date:
        due_date
        |> previous_due_date()
        |> closing_date_from_due(closing_offset)
        |> Date.add(1)
    }
  end

  defp due_date_for(reference_date, due_day) do
    last_day = Date.end_of_month(reference_date).day
    day = min(due_day, last_day)

    Date.new!(reference_date.year, reference_date.month, day)
  end

  defp closing_date_from_due(due_date, offset),
    do: Date.add(due_date, -offset)

  defp previous_due_date(due_date),
    do: Date.shift(due_date, month: -1)

  defp shift_if_needed(%__MODULE__{} = cycle, reference_date) do
    if Date.after?(reference_date, cycle.end_date) do
      next(cycle, reference_date)
    else
      cycle
    end
  end

  defp next(%__MODULE__{due_day: due_day, closing_offset: offset}, reference_date) do
    reference_date
    |> Date.shift(month: 1)
    |> due_date_for(due_day)
    |> from_due_date(due_day, offset)
  end

  def to_invoice_period(%__MODULE__{} = cycle) do
    %{
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      due_date: cycle.due_date
    }
  end
end
