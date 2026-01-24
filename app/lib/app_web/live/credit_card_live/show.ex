defmodule AppWeb.CreditCardLive.Show do
  use AppWeb, :live_view

  alias App.Credit

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Credit card {@credit_card.id}
        <:subtitle>This is a credit_card record from your database.</:subtitle>
        <:actions>
          <.button navigate={~p"/credit_cards"}>
            <.icon name="hero-arrow-left" />
          </.button>
          <.button variant="primary" navigate={~p"/credit_cards/#{@credit_card}/edit?return_to=show"}>
            <.icon name="hero-pencil-square" /> Edit credit_card
          </.button>
        </:actions>
      </.header>

      <.list>
        <:item title="Name">{@credit_card.name}</:item>
        <:item title="Limit">{@credit_card.limit}</:item>
        <:item title="Due day">{@credit_card.due_day}</:item>
      </.list>
    </Layouts.app>
    """
  end

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Show Credit card")
     |> assign(:credit_card, Credit.get_credit_card!(id))}
  end
end
