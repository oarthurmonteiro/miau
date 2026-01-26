defmodule App.Credit.Cycle do
  @type t :: %{
          due_date: Date.t(),
          start_date: Date.t(),
          end_date: Date.t()
        }

  @spec from_due_date(Date.t(), non_neg_integer()) :: t()
  def from_due_date(due_date, closing_offset) do
    %{
      due_date: due_date,
      end_date: closing_date(due_date, closing_offset),
      start_date:
        due_date
        |> previous_due_date()
        |> closing_date(closing_offset)
        |> Date.add(1)
    }
  end

  defp closing_date(due_date, offset),
    do: Date.add(due_date, -offset)

  defp previous_due_date(due_date),
    do: Date.shift(due_date, month: -1)
end
