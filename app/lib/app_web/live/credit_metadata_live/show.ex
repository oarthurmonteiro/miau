defmodule AppWeb.CreditMetadataLive.Show do
  use AppWeb, :live_view

  alias App.Ledger

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Credit metadata {@credit_metadata.id}
        <:subtitle>This is a credit_metadata record from your database.</:subtitle>
        <:actions>
          <.button navigate={~p"/credit_metadata"}>
            <.icon name="hero-arrow-left" />
          </.button>
          <.button variant="primary" navigate={~p"/credit_metadata/#{@credit_metadata}/edit?return_to=show"}>
            <.icon name="hero-pencil-square" /> Edit credit_metadata
          </.button>
        </:actions>
      </.header>

      <.list>
        <:item title="Total installments">{@credit_metadata.total_installments}</:item>
        <:item title="Installment number">{@credit_metadata.installment_number}</:item>
      </.list>
    </Layouts.app>
    """
  end

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Show Credit metadata")
     |> assign(:credit_metadata, Ledger.get_credit_metadata!(id))}
  end
end
