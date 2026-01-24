defmodule App.CreditTest do
  use App.DataCase

  alias App.Credit

  describe "credit_cards" do
    alias App.Credit.CreditCard

    import App.CreditFixtures

    @invalid_attrs %{name: nil, limit: nil, due_day: nil}

    test "list_credit_cards/0 returns all credit_cards" do
      credit_card = credit_card_fixture()
      assert Credit.list_credit_cards() == [credit_card]
    end

    test "get_credit_card!/1 returns the credit_card with given id" do
      credit_card = credit_card_fixture()
      assert Credit.get_credit_card!(credit_card.id) == credit_card
    end

    test "create_credit_card/1 with valid data creates a credit_card" do
      valid_attrs = %{name: "some name", limit: "120.5", due_day: 42}

      assert {:ok, %CreditCard{} = credit_card} = Credit.create_credit_card(valid_attrs)
      assert credit_card.name == "some name"
      assert credit_card.limit == Decimal.new("120.5")
      assert credit_card.due_day == 42
    end

    test "create_credit_card/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Credit.create_credit_card(@invalid_attrs)
    end

    test "update_credit_card/2 with valid data updates the credit_card" do
      credit_card = credit_card_fixture()
      update_attrs = %{name: "some updated name", limit: "456.7", due_day: 43}

      assert {:ok, %CreditCard{} = credit_card} = Credit.update_credit_card(credit_card, update_attrs)
      assert credit_card.name == "some updated name"
      assert credit_card.limit == Decimal.new("456.7")
      assert credit_card.due_day == 43
    end

    test "update_credit_card/2 with invalid data returns error changeset" do
      credit_card = credit_card_fixture()
      assert {:error, %Ecto.Changeset{}} = Credit.update_credit_card(credit_card, @invalid_attrs)
      assert credit_card == Credit.get_credit_card!(credit_card.id)
    end

    test "delete_credit_card/1 deletes the credit_card" do
      credit_card = credit_card_fixture()
      assert {:ok, %CreditCard{}} = Credit.delete_credit_card(credit_card)
      assert_raise Ecto.NoResultsError, fn -> Credit.get_credit_card!(credit_card.id) end
    end

    test "change_credit_card/1 returns a credit_card changeset" do
      credit_card = credit_card_fixture()
      assert %Ecto.Changeset{} = Credit.change_credit_card(credit_card)
    end
  end
end
