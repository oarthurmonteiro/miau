defmodule App.Credit.Invoice do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "invoices" do
    field(:start_date, :date)
    field(:end_date, :date)

    field(:total_amount, :decimal)
    field(:amount_paid, :decimal)
    field(:remaining_balance, :decimal)

    field(:status, Ecto.Enum, values: [:open, :closed, :partially_paid, :paid])

    belongs_to(:account, App.Ledger.Account)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(invoice, attrs) do
    invoice
    |> cast(attrs, [
      :start_date,
      :end_date,
      :total_amount,
      :amount_paid,
      :remaining_balance,
      :status,
      :credit_card_id
    ])
    |> validate_required([:start_date, :end_date, :status, :credit_card_id])
  end

  @doc "Calcula datas sem efeitos colaterais. Fácil de testar com 'mix test'."
  def calculate_dates(due_day, month, year, closing_offset) do
    # 1. Data de Vencimento desta fatura
    {:ok, current_due} = Date.new(year, month, due_day)

    # 2. Data de Fechamento desta fatura (Vencimento - Offset)
    # Se vencimento 11/02 e offset 10 -> end_date = 01/02
    # end_date = Date.add(current_due, -closing_offset)
    end_date =
      Date.add(current_due, -closing_offset)

    # |> to_previous_working_day

    # 3. Para achar o início, calculamos o fechamento do MÊS ANTERIOR
    # Primeiro, achamos o vencimento do mês passado
    last_month_due = Date.shift(current_due, month: -1)

    # Fechamento anterior = Vencimento anterior - Offset
    # Se vencimento anterior 11/01 e offset 10 -> fechamento_anterior = 01/01
    last_closing_date =
      Date.add(last_month_due, -closing_offset)

    # |> to_previous_working_day()

    # 4. O início desta fatura é o dia seguinte ao fechamento anterior
    # start_date = 02/01
    start_date = Date.add(last_closing_date, 1)

    %{
      start_date: start_date,
      end_date: end_date,
      due_date: current_due
    }
  end

  # defp to_previous_working_day(date, holidays \\ [~D[2026-01-01]]) do
  #   cond do
  #     # Date.day_of_week(date) in [6, 7] ->
  #     #   to_previous_working_day(Date.add(date, -1), holidays)

  #     # date in holidays ->
  #     #   to_previous_working_day(Date.add(date, -1), holidays)

  #     true ->
  #       date
  #   end
  # end
end
