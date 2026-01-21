defmodule AppWeb.Ledger.TransactionLive.Form do
  use AppWeb, :live_view

  alias App.Ledger
  alias App.Ledger.Transaction

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        {@page_title}
        <:subtitle>Use this form to manage transaction records in your database.</:subtitle>
      </.header>

      <.form for={@form} id="transaction-form" phx-change="validate" phx-submit="save">
        <.input field={@form[:description]} type="text" label="Description" />
        <.input field={@form[:amount]} type="number" label="Amount" step="any" />
        <.input field={@form[:occurred_at]} type="date" label="Occurred at" />
        <.input
          field={@form[:type]}
          type="select"
          label="Type"
          prompt="Choose a value"
          options={Ecto.Enum.values(App.Ledger.Transaction, :type)}
        />
        <.input
          field={@form[:account_id]}
          type="select"
          label="Account"
          options={App.Ledger.list_accounts() |> Enum.map(&{&1.name, &1.id})}
        />
        <footer>
          <.button phx-disable-with="Saving..." variant="primary">Save Transaction</.button>
          <.button navigate={return_path(@return_to, @transaction)}>Cancel</.button>
        </footer>
      </.form>
    </Layouts.app>
    """
  end

  @impl true
  def mount(params, _session, socket) do
    {:ok,
     socket
     |> assign(:return_to, return_to(params["return_to"]))
     |> apply_action(socket.assigns.live_action, params)}
  end

  defp return_to("show"), do: "show"
  defp return_to(_), do: "index"

  defp apply_action(socket, :edit, %{"id" => id}) do
    transaction = Ledger.get_transaction!(id)

    socket
    |> assign(:page_title, "Edit Transaction")
    |> assign(:transaction, transaction)
    |> assign(:form, to_form(Ledger.change_transaction(transaction)))
  end

  defp apply_action(socket, :new, _params) do
    transaction = %Transaction{}

    socket
    |> assign(:page_title, "New Transaction")
    |> assign(:transaction, transaction)
    |> assign(:form, to_form(Ledger.change_transaction(transaction)))
  end

  @impl true
  def handle_event("validate", %{"transaction" => transaction_params}, socket) do
    changeset = Ledger.change_transaction(socket.assigns.transaction, transaction_params)
    {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end

  def handle_event("save", %{"transaction" => transaction_params}, socket) do
    save_transaction(socket, socket.assigns.live_action, transaction_params)
  end

  defp save_transaction(socket, :edit, transaction_params) do
    case Ledger.update_transaction(socket.assigns.transaction, transaction_params) do
      {:ok, transaction} ->
        {:noreply,
         socket
         |> put_flash(:info, "Transaction updated successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, transaction))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp save_transaction(socket, :new, transaction_params) do
    case Ledger.create_transaction(transaction_params) do
      {:ok, transaction} ->
        {:noreply,
         socket
         |> put_flash(:info, "Transaction created successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, transaction))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp return_path("index", _transaction), do: ~p"/ledger/transactions"
  defp return_path("show", transaction), do: ~p"/ledger/transactions/#{transaction}"
end
