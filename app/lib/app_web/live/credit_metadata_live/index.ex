defmodule AppWeb.CreditMetadataLive.Index do
  use AppWeb, :live_view

  alias App.Ledger

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Listing Credit metadata
        <:actions>
          <.button variant="primary" navigate={~p"/credit_metadata/new"}>
            <.icon name="hero-plus" /> New Credit metadata
          </.button>
        </:actions>
      </.header>

      <.table
        id="credit_metadata"
        rows={@streams.credit_metadata_collection}
        row_click={fn {_id, credit_metadata} -> JS.navigate(~p"/credit_metadata/#{credit_metadata}") end}
      >
        <:col :let={{_id, credit_metadata}} label="Total installments">{credit_metadata.total_installments}</:col>
        <:col :let={{_id, credit_metadata}} label="Installment number">{credit_metadata.installment_number}</:col>
        <:action :let={{_id, credit_metadata}}>
          <div class="sr-only">
            <.link navigate={~p"/credit_metadata/#{credit_metadata}"}>Show</.link>
          </div>
          <.link navigate={~p"/credit_metadata/#{credit_metadata}/edit"}>Edit</.link>
        </:action>
        <:action :let={{id, credit_metadata}}>
          <.link
            phx-click={JS.push("delete", value: %{id: credit_metadata.id}) |> hide("##{id}")}
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
     |> assign(:page_title, "Listing Credit metadata")
     |> stream(:credit_metadata_collection, list_credit_metadata())}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    credit_metadata = Ledger.get_credit_metadata!(id)
    {:ok, _} = Ledger.delete_credit_metadata(credit_metadata)

    {:noreply, stream_delete(socket, :credit_metadata_collection, credit_metadata)}
  end

  defp list_credit_metadata() do
    Ledger.list_credit_metadata()
  end
end
