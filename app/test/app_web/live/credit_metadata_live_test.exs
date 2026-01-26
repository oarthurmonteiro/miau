defmodule AppWeb.CreditMetadataLiveTest do
  use AppWeb.ConnCase

  import Phoenix.LiveViewTest
  import App.LedgerFixtures

  @create_attrs %{total_installments: 42, installment_number: 42}
  @update_attrs %{total_installments: 43, installment_number: 43}
  @invalid_attrs %{total_installments: nil, installment_number: nil}
  defp create_credit_metadata(_) do
    credit_metadata = credit_metadata_fixture()

    %{credit_metadata: credit_metadata}
  end

  describe "Index" do
    setup [:create_credit_metadata]

    test "lists all credit_metadata", %{conn: conn} do
      {:ok, _index_live, html} = live(conn, ~p"/credit_metadata")

      assert html =~ "Listing Credit metadata"
    end

    test "saves new credit_metadata", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_metadata")

      assert {:ok, form_live, _} =
               index_live
               |> element("a", "New Credit metadata")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_metadata/new")

      assert render(form_live) =~ "New Credit metadata"

      assert form_live
             |> form("#credit_metadata-form", credit_metadata: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#credit_metadata-form", credit_metadata: @create_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_metadata")

      html = render(index_live)
      assert html =~ "Credit metadata created successfully"
    end

    test "updates credit_metadata in listing", %{conn: conn, credit_metadata: credit_metadata} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_metadata")

      assert {:ok, form_live, _html} =
               index_live
               |> element("#credit_metadata_collection-#{credit_metadata.id} a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_metadata/#{credit_metadata}/edit")

      assert render(form_live) =~ "Edit Credit metadata"

      assert form_live
             |> form("#credit_metadata-form", credit_metadata: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, index_live, _html} =
               form_live
               |> form("#credit_metadata-form", credit_metadata: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_metadata")

      html = render(index_live)
      assert html =~ "Credit metadata updated successfully"
    end

    test "deletes credit_metadata in listing", %{conn: conn, credit_metadata: credit_metadata} do
      {:ok, index_live, _html} = live(conn, ~p"/credit_metadata")

      assert index_live |> element("#credit_metadata_collection-#{credit_metadata.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#credit_metadata-#{credit_metadata.id}")
    end
  end

  describe "Show" do
    setup [:create_credit_metadata]

    test "displays credit_metadata", %{conn: conn, credit_metadata: credit_metadata} do
      {:ok, _show_live, html} = live(conn, ~p"/credit_metadata/#{credit_metadata}")

      assert html =~ "Show Credit metadata"
    end

    test "updates credit_metadata and returns to show", %{conn: conn, credit_metadata: credit_metadata} do
      {:ok, show_live, _html} = live(conn, ~p"/credit_metadata/#{credit_metadata}")

      assert {:ok, form_live, _} =
               show_live
               |> element("a", "Edit")
               |> render_click()
               |> follow_redirect(conn, ~p"/credit_metadata/#{credit_metadata}/edit?return_to=show")

      assert render(form_live) =~ "Edit Credit metadata"

      assert form_live
             |> form("#credit_metadata-form", credit_metadata: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      assert {:ok, show_live, _html} =
               form_live
               |> form("#credit_metadata-form", credit_metadata: @update_attrs)
               |> render_submit()
               |> follow_redirect(conn, ~p"/credit_metadata/#{credit_metadata}")

      html = render(show_live)
      assert html =~ "Credit metadata updated successfully"
    end
  end
end
