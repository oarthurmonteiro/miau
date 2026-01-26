defmodule AppWeb.CreditCardLive.Index do
  use AppWeb, :live_view

  alias App.Credit

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Listing Credit cards
        <:actions>
          <.button variant="primary" navigate={~p"/credit_cards/new"}>
            <.icon name="hero-plus" /> New Credit card
          </.button>
        </:actions>
      </.header>

      <.table
        id="credit_cards"
        rows={@streams.credit_cards}
        row_click={fn {_id, credit_card} -> JS.navigate(~p"/credit_cards/#{credit_card}") end}
      >
        <:col :let={{_id, credit_card}} label="Name">{App.Portfolio.get_account!(credit_card.account_id).name}</:col>
        <:col :let={{_id, credit_card}} label="Limit">{credit_card.limit}</:col>
        <:col :let={{_id, credit_card}} label="Due day">{credit_card.due_day}</:col>
        <:action :let={{_id, credit_card}}>
          <div class="sr-only">
            <.link navigate={~p"/credit_cards/#{credit_card}"}>Show</.link>
          </div>
          <.link navigate={~p"/credit_cards/#{credit_card}/edit"}>Edit</.link>
        </:action>
        <:action :let={{id, credit_card}}>
          <.link
            phx-click={JS.push("delete", value: %{id: credit_card.id}) |> hide("##{id}")}
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
     |> assign(:page_title, "Listing Credit cards")
     |> stream(:credit_cards, list_credit_cards())}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    credit_card = Credit.get_credit_card!(id)
    {:ok, _} = Credit.delete_credit_card(credit_card)

    {:noreply, stream_delete(socket, :credit_cards, credit_card)}
  end

  defp list_credit_cards() do
    Credit.list_credit_cards()
  end
end
