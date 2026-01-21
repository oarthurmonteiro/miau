defmodule AppWeb.Ledger.CategoryLive.Index do
  use AppWeb, :live_view

  alias App.Ledger

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Listing Categories
        <:actions>
          <.button variant="primary" navigate={~p"/ledger/categories/new"}>
            <.icon name="hero-plus" /> New Category
          </.button>
        </:actions>
      </.header>

      <.table
        id="categories"
        rows={@streams.categories}
        row_click={fn {_id, category} -> JS.navigate(~p"/ledger/categories/#{category}") end}
      >
        <:col :let={{_id, category}} label="Name">{category.name}</:col>
        <:action :let={{_id, category}}>
          <div class="sr-only">
            <.link navigate={~p"/ledger/categories/#{category}"}>Show</.link>
          </div>
          <.link navigate={~p"/ledger/categories/#{category}/edit"}>Edit</.link>
        </:action>
        <:action :let={{id, category}}>
          <.link
            phx-click={JS.push("delete", value: %{id: category.id}) |> hide("##{id}")}
            data-confirm="Are you sure?"
          >
            Delete
          </.link>
        </:action>
      </.table>
    </Layouts.app>
    """
  end

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Listing Categories")
     |> stream(:categories, list_categories())}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    category = Ledger.get_category!(id)
    {:ok, _} = Ledger.delete_category(category)

    {:noreply, stream_delete(socket, :categories, category)}
  end

  defp list_categories() do
    Ledger.list_categories()
  end
end
