defmodule AppWeb.Ledger.TransactionLiveTest do
  use AppWeb.ConnCase

  import Phoenix.LiveViewTest
  import App.LedgerFixtures

  @create_attrs %{type: :income, description: "some description", amount: "120.5", occurred_at: "2026-01-20"}
  @update_attrs %{type: :expense, description: "some updated description", amount: "456.7", occurred_at: "2026-01-21"}
  @invalid_attrs %{type: nil, description: nil, amount: nil, occurred_at: nil}
  defp create_transaction(_) do
    transaction = transaction_fixture()

    %{transaction: transaction}
  end

  describe "Index" do
    setup [:create_transaction]

    test "lists all transactions", %{conn: conn, transaction: transaction} do
      {:ok, _index_live, html} = live(conn, ~p"/ledger/transactions")

      assert html =~ "Listing Transactions"
      assert html =~ transaction.description
    end

    test "saves new transaction", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, ~p"/ledger/transactions")

      assert {:ok, form_live, _} =
               index_live
               |> element("a", "New Transaction")
               |> render_click()
               |> follow_redirect(conn, ~p"/ledger/transactions/new")

      assert render(form_live) =~ "New Transaction"

      assert form_live
             |> form("#transaction-form", transaction: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#transaction-form", transaction: @create_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/ledger/transactions")

      html = render(index_live)
      assert html =~ "Transaction created successfully"
      assert html =~ "some description"
    end

    test "updates transaction in listing", %{conn: conn, transaction: transaction} do
      {:ok, index_live, _html} = live(conn, ~p"/ledger/transactions")

      assert {:ok, form_live, _html} =
               index_live
               |> element("#transactions-#{transaction.id} a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/ledger/transactions/#{transaction}/edit")

      assert render(form_live) =~ "Edit Transaction"

      assert form_live
             |> form("#transaction-form", transaction: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#transaction-form", transaction: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/ledger/transactions")

      html = render(index_live)
      assert html =~ "Transaction updated successfully"
      assert html =~ "some updated description"
    end

    test "deletes transaction in listing", %{conn: conn, transaction: transaction} do
      {:ok, index_live, _html} = live(conn, ~p"/ledger/transactions")

      assert index_live |> element("#transactions-#{transaction.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#transactions-#{transaction.id}")
    end
  end

  describe "Show" do
    setup [:create_transaction]

    test "displays transaction", %{conn: conn, transaction: transaction} do
      {:ok, _show_live, html} = live(conn, ~p"/ledger/transactions/#{transaction}")

      assert html =~ "Show Transaction"
      assert html =~ transaction.description
    end

    test "updates transaction and returns to show", %{conn: conn, transaction: transaction} do
      {:ok, show_live, _html} = live(conn, ~p"/ledger/transactions/#{transaction}")

      assert {:ok, form_live, _} =
               show_live
               |> element("a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/ledger/transactions/#{transaction}/edit?return_to=show")

      assert render(form_live) =~ "Edit Transaction"

      assert form_live
             |> form("#transaction-form", transaction: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, show_live, _html} =
               form_live
               |> form("#transaction-form", transaction: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/ledger/transactions/#{transaction}")

      html = render(show_live)
      assert html =~ "Transaction updated successfully"
      assert html =~ "some updated description"
    end
  end
end
