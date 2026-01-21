defmodule AppWeb.Ledger.TransactionLive.Index do
  use AppWeb, :live_view

  alias App.Ledger

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        Listing Transactions
        <:actions>
          <.button variant="primary" navigate={~p"/ledger/transactions/new"}>
            <.icon name="hero-plus" /> New Transaction
          </.button>
        </:actions>
      </.header>

      <.table
        id="transactions"
        rows={@streams.transactions}
        row_click={fn {_id, transaction} -> JS.navigate(~p"/ledger/transactions/#{transaction}") end}
      >
        <:col :let={{_id, transaction}} label="Description">{transaction.description}</:col>
        <:col :let={{_id, transaction}} label="Amount">{transaction.amount}</:col>
        <:col :let={{_id, transaction}} label="Occurred at">{transaction.occurred_at}</:col>
        <:col :let={{_id, transaction}} label="Type">{transaction.type}</:col>
        <:action :let={{_id, transaction}}>
          <div class="sr-only">
            <.link navigate={~p"/ledger/transactions/#{transaction}"}>Show</.link>
          </div>
          <.link navigate={~p"/ledger/transactions/#{transaction}/edit"}>Edit</.link>
        </:action>
        <:action :let={{id, transaction}}>
          <.link
            phx-click={JS.push("delete", value: %{id: transaction.id}) |> hide("##{id}")}
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
     |> assign(:page_title, "Listing Transactions")
     |> stream(:transactions, list_transactions())}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    transaction = Ledger.get_transaction!(id)
    {:ok, _} = Ledger.delete_transaction(transaction)

    {:noreply, stream_delete(socket, :transactions, transaction)}
  end

  defp list_transactions() do
    Ledger.list_transactions()
  end
end
