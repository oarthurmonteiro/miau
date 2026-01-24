defmodule AppWeb.Credit.CreditCardLiveTest do
  use AppWeb.ConnCase

  import Phoenix.LiveViewTest
  import App.CreditFixtures

  @create_attrs %{name: "some name", limit: "120.5", due_day: 42}
  @update_attrs %{name: "some updated name", limit: "456.7", due_day: 43}
  @invalid_attrs %{name: nil, limit: nil, due_day: nil}
  defp create_credit_card(_) do
    credit_card = credit_card_fixture()

    %{credit_card: credit_card}
  end

  describe "Index" do
    setup [:create_credit_card]

    test "lists all credit_cards", %{conn: conn, credit_card: credit_card} do
      {:ok, _index_live, html} = live(conn, ~p"/credit_cards")

      assert html =~ "Listing Credit cards"
      assert html =~ credit_card.name
    end

    test "saves new credit_card", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_cards")

      assert {:ok, form_live, _} =
               index_live
               |> element("a", "New Credit card")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_cards/new")

      assert render(form_live) =~ "New Credit card"

      assert form_live
             |> form("#credit_card-form", credit_card: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#credit_card-form", credit_card: @create_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_cards")

      html = render(index_live)
      assert html =~ "Credit card created successfully"
      assert html =~ "some name"
    end

    test "updates credit_card in listing", %{conn: conn, credit_card: credit_card} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_cards")

      assert {:ok, form_live, _html} =
               index_live
               |> element("#credit_cards-#{credit_card.id} a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_cards/#{credit_card}/edit")

      assert render(form_live) =~ "Edit Credit card"

      assert form_live
             |> form("#credit_card-form", credit_card: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#credit_card-form", credit_card: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_cards")

      html = render(index_live)
      assert html =~ "Credit card updated successfully"
      assert html =~ "some updated name"
    end

    test "deletes credit_card in listing", %{conn: conn, credit_card: credit_card} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_cards")

      assert index_live
             |> element("#credit_cards-#{credit_card.id} a", "Delete")
             |> render_click()

      refute has_element?(index_live, "#credit_cards-#{credit_card.id}")
    end
  end

  describe "Show" do
    setup [:create_credit_card]

    test "displays credit_card", %{conn: conn, credit_card: credit_card} do
      {:ok, _show_live, html} = live(conn, ~p"/credit_cards/#{credit_card}")

      assert html =~ "Show Credit card"
      assert html =~ credit_card.name
    end

    test "updates credit_card and returns to show", %{conn: conn, credit_card: credit_card} do
      {:ok, show_live, _html} = live(conn, ~p"/credit_cards/#{credit_card}")

      assert {:ok, form_live, _} =
               show_live
               |> element("a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_cards/#{credit_card}/edit?return_to=show")

      assert render(form_live) =~ "Edit Credit card"

      assert form_live
             |> form("#credit_card-form", credit_card: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, show_live, _html} =
               form_live
               |> form("#credit_card-form", credit_card: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_cards/#{credit_card}")

      html = render(show_live)
      assert html =~ "Credit card updated successfully"
      assert html =~ "some updated name"
    end
  end
end
