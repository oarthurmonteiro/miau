defmodule App.Credit.CreditCardTest do
  use App.DataCase, async: true
  alias App.Credit.CreditCard

  import App.CreditFixtures
  import App.PortfolioFixtures

  @valid_attrs %{limit: "1000.00", due_day: 10, closing_day_offset: 5}

  test "changeset validates due_day range" do
    # Test lower bound
    invalid_changeset = CreditCard.changeset(%CreditCard{}, Map.put(@valid_attrs, :due_day, 0))
    assert %{due_day: ["must be greater than or equal to 1"]} = errors_on(invalid_changeset)

    # Test upper bound
    invalid_changeset = CreditCard.changeset(%CreditCard{}, Map.put(@valid_attrs, :due_day, 32))
    assert %{due_day: ["must be less than or equal to 31"]} = errors_on(invalid_changeset)
  end

  test "unique_constraint prevents two cards for same account" do
    account = account_fixture(%{type: :credit})
    attrs = Map.put(@valid_attrs, :account_id, account.id)

    # First card succeeds
    assert {:ok, _card} = %CreditCard{} |> CreditCard.changeset(attrs) |> Repo.insert()

    # Second card for same account fails at DB level
    assert {:error, changeset} = %CreditCard{} |> CreditCard.changeset(attrs) |> Repo.insert()
    assert %{account_id: ["has already been taken"]} = errors_on(changeset)
  end
end
