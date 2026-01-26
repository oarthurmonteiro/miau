defmodule App.LedgerTest do
  use App.DataCase

  alias App.Ledger

  describe "categories" do
    alias App.Ledger.Category

    import App.LedgerFixtures

    @invalid_attrs %{name: nil}

    test "list_categories/0 returns all categories" do
      category = category_fixture()
      assert Ledger.list_categories() == [category]
    end

    test "get_category!/1 returns the category with given id" do
      category = category_fixture()
      assert Ledger.get_category!(category.id) == category
    end

    test "create_category/1 with valid data creates a category" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Category{} = category} = Ledger.create_category(valid_attrs)
      assert category.name == "some name"
    end

    test "create_category/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Ledger.create_category(@invalid_attrs)
    end

    test "update_category/2 with valid data updates the category" do
      category = category_fixture()
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Category{} = category} = Ledger.update_category(category, update_attrs)
      assert category.name == "some updated name"
    end

    test "update_category/2 with invalid data returns error changeset" do
      category = category_fixture()
      assert {:error, %Ecto.Changeset{}} = Ledger.update_category(category, @invalid_attrs)
      assert category == Ledger.get_category!(category.id)
    end

    test "delete_category/1 deletes the category" do
      category = category_fixture()
      assert {:ok, %Category{}} = Ledger.delete_category(category)
      assert_raise Ecto.NoResultsError, fn -> Ledger.get_category!(category.id) end
    end

    test "change_category/1 returns a category changeset" do
      category = category_fixture()
      assert %Ecto.Changeset{} = Ledger.change_category(category)
    end
  end

  describe "accounts" do
    alias App.Portfolio.Account

    import App.PortfolioFixtures

    @invalid_attrs %{name: nil, initial_balance: nil, current_balance: nil}

    test "list_accounts/0 returns all accounts" do
      account = account_fixture()
      assert Portfolio.list_accounts() == [account]
    end

    test "get_account!/1 returns the account with given id" do
      account = account_fixture()
      assert Portfolio.get_account!(account.id) == account
    end

    test "create_account/1 with valid data creates a account" do
      valid_attrs = %{name: "some name", initial_balance: "120.5", current_balance: "120.5"}

      assert {:ok, %Account{} = account} = Portfolio.create_account(valid_attrs)
      assert account.name == "some name"
      assert account.initial_balance == Decimal.new("120.5")
      assert account.current_balance == Decimal.new("120.5")
    end

    test "create_account/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Portfolio.create_account(@invalid_attrs)
    end

    test "update_account/2 with valid data updates the account" do
      account = account_fixture()
      update_attrs = %{name: "some updated name", initial_balance: "456.7", current_balance: "456.7"}

      assert {:ok, %Account{} = account} = Portfolio.update_account(account, update_attrs)
      assert account.name == "some updated name"
      assert account.initial_balance == Decimal.new("456.7")
      assert account.current_balance == Decimal.new("456.7")
    end

    test "update_account/2 with invalid data returns error changeset" do
      account = account_fixture()
      assert {:error, %Ecto.Changeset{}} = Portfolio.update_account(account, @invalid_attrs)
      assert account == Portfolio.get_account!(account.id)
    end

    test "delete_account/1 deletes the account" do
      account = account_fixture()
      assert {:ok, %Account{}} = Portfolio.delete_account(account)
      assert_raise Ecto.NoResultsError, fn -> Portfolio.get_account!(account.id) end
    end

    test "change_account/1 returns a account changeset" do
      account = account_fixture()
      assert %Ecto.Changeset{} = Portfolio.change_account(account)
    end
  end

  describe "transactions" do
    alias App.Ledger.Transaction

    import App.LedgerFixtures

    @invalid_attrs %{type: nil, description: nil, amount: nil, occurred_at: nil}

    test "list_transactions/0 returns all transactions" do
      transaction = transaction_fixture()
      assert Ledger.list_transactions() == [transaction]
    end

    test "get_transaction!/1 returns the transaction with given id" do
      transaction = transaction_fixture()
      assert Ledger.get_transaction!(transaction.id) == transaction
    end

    test "create_transaction/1 with valid data creates a transaction" do
      valid_attrs = %{type: :income, description: "some description", amount: "120.5", occurred_at: ~D[2026-01-20]}

      assert {:ok, %Transaction{} = transaction} = Ledger.create_transaction(valid_attrs)
      assert transaction.type == :income
      assert transaction.description == "some description"
      assert transaction.amount == Decimal.new("120.5")
      assert transaction.occurred_at == ~D[2026-01-20]
    end

    test "create_transaction/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Ledger.create_transaction(@invalid_attrs)
    end

    test "update_transaction/2 with valid data updates the transaction" do
      transaction = transaction_fixture()
      update_attrs = %{type: :expense, description: "some updated description", amount: "456.7", occurred_at: ~D[2026-01-21]}

      assert {:ok, %Transaction{} = transaction} = Ledger.update_transaction(transaction, update_attrs)
      assert transaction.type == :expense
      assert transaction.description == "some updated description"
      assert transaction.amount == Decimal.new("456.7")
      assert transaction.occurred_at == ~D[2026-01-21]
    end

    test "update_transaction/2 with invalid data returns error changeset" do
      transaction = transaction_fixture()
      assert {:error, %Ecto.Changeset{}} = Ledger.update_transaction(transaction, @invalid_attrs)
      assert transaction == Ledger.get_transaction!(transaction.id)
    end

    test "delete_transaction/1 deletes the transaction" do
      transaction = transaction_fixture()
      assert {:ok, %Transaction{}} = Ledger.delete_transaction(transaction)
      assert_raise Ecto.NoResultsError, fn -> Ledger.get_transaction!(transaction.id) end
    end

    test "change_transaction/1 returns a transaction changeset" do
      transaction = transaction_fixture()
      assert %Ecto.Changeset{} = Ledger.change_transaction(transaction)
    end
  end

  describe "credit_metadata" do
    alias App.Ledger.CreditMetadata

    import App.LedgerFixtures

    @invalid_attrs %{total_installments: nil, installment_number: nil}

    test "list_credit_metadata/0 returns all credit_metadata" do
      credit_metadata = credit_metadata_fixture()
      assert Ledger.list_credit_metadata() == [credit_metadata]
    end

    test "get_credit_metadata!/1 returns the credit_metadata with given id" do
      credit_metadata = credit_metadata_fixture()
      assert Ledger.get_credit_metadata!(credit_metadata.id) == credit_metadata
    end

    test "create_credit_metadata/1 with valid data creates a credit_metadata" do
      valid_attrs = %{total_installments: 42, installment_number: 42}

      assert {:ok, %CreditMetadata{} = credit_metadata} = Ledger.create_credit_metadata(valid_attrs)
      assert credit_metadata.total_installments == 42
      assert credit_metadata.installment_number == 42
    end

    test "create_credit_metadata/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Ledger.create_credit_metadata(@invalid_attrs)
    end

    test "update_credit_metadata/2 with valid data updates the credit_metadata" do
      credit_metadata = credit_metadata_fixture()
      update_attrs = %{total_installments: 43, installment_number: 43}

      assert {:ok, %CreditMetadata{} = credit_metadata} = Ledger.update_credit_metadata(credit_metadata, update_attrs)
      assert credit_metadata.total_installments == 43
      assert credit_metadata.installment_number == 43
    end

    test "update_credit_metadata/2 with invalid data returns error changeset" do
      credit_metadata = credit_metadata_fixture()
      assert {:error, %Ecto.Changeset{}} = Ledger.update_credit_metadata(credit_metadata, @invalid_attrs)
      assert credit_metadata == Ledger.get_credit_metadata!(credit_metadata.id)
    end

    test "delete_credit_metadata/1 deletes the credit_metadata" do
      credit_metadata = credit_metadata_fixture()
      assert {:ok, %CreditMetadata{}} = Ledger.delete_credit_metadata(credit_metadata)
      assert_raise Ecto.NoResultsError, fn -> Ledger.get_credit_metadata!(credit_metadata.id) end
    end

    test "change_credit_metadata/1 returns a credit_metadata changeset" do
      credit_metadata = credit_metadata_fixture()
      assert %Ecto.Changeset{} = Ledger.change_credit_metadata(credit_metadata)
    end
  end
end
