defmodule App.Credit.Installment do
  def build_plan(
        %{
          amount: amount,
          occurred_at: date,
          total_installments: total,
          description: description
        } = _attrs
      ) do
    amount_per = Decimal.div(amount, total)

    installments =
      for i <- 1..total do
        %{
          installment_number: i,
          total_installments: total,
          amount: amount_per,
          occurred_at: Date.shift(date, month: i - 1),
          description: "#{description} (#{installment_number}/#{total})"
        }
      end

    %{
      total: total,
      amount_per_installments: amount_per,
      installments: installments
    }
  end
end
