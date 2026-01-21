defmodule AppWeb.Ledger.AccountLive.Show do
  use AppWeb, :live_view

  alias App.Ledger

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Account {@account.id}
        <:subtitle>This is a account record from your database.</:subtitle>
        <:actions>
          <.button navigate={~p"/ledger/accounts"}>
            <.icon name="hero-arrow-left" />
          </.button>
          <.button variant="primary" navigate={~p"/ledger/accounts/#{@account}/edit?return_to=show"}>
            <.icon name="hero-pencil-square" /> Edit account
          </.button>
        </:actions>
      </.header>

      <.list>
        <:item title="Name">{@account.name}</:item>
        <:item title="Initial balance">{@account.initial_balance}</:item>
        <:item title="Current balance">{@account.current_balance}</:item>
      </.list>
    </Layouts.app>
    """
  end

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "Show Account")
     |> assign(:account, Ledger.get_account!(id))}
  end
end
