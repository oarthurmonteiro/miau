defmodule AppWeb.TransactionLive.Form do
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
          options={Ecto.Enum.values(App.Ledger.TransactionForm, :type)}
        />
        <.input
          field={@form[:category_id]}
          type="select"
          label="Category"
          options={App.Ledger.list_categories() |> Enum.map(&{&1.name, &1.id})}
        />
        <.input
          field={@form[:account_id]}
          type="select"
          label="Account"
          prompt="Selecione uma conta"
          options={@accounts |> Enum.map(&{&1.name, &1.id})}
        />

        <%!-- CAMPO CONDICIONAL --%>
      <%= if @is_credit do %>
      <div class="grid grid-cols-2 gap-4">
        <.input
          field={@form[:total_installments]}
          label="Nº de Parcelas"
          type="number"
          min="1"
          value="1"
        />
        <p class="text-xs text-gray-500 mt-8">
          A transação será dividida nas próximas faturas.
        </p>
      </div>
      <% end %>

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
     |> assign(:accounts, App.Portfolio.list_accounts())
     |> apply_action(socket.assigns.live_action, params)}
  end

  defp return_to("show"), do: "show"
  defp return_to(_), do: "index"

  defp apply_action(socket, :edit, %{"id" => id}) do
    transaction = Ledger.get_transaction!(id)

    is_credit? = App.Portfolio.get_account!(transaction.account_id).type == :credit

    socket
    |> assign(:page_title, "Edit Transaction")
    |> assign(:transaction, transaction)
    |> assign(:is_credit, is_credit?)
    |> assign(:form, to_form(Ledger.change_transaction(transaction)))
  end

  defp apply_action(socket, :new, _params) do
    transaction = %Transaction{}

    socket
    |> assign(:page_title, "New Transaction")
    |> assign(:transaction, transaction)
    |> assign(:is_credit, false)
    |> assign(:form, to_form(Ledger.change_transaction(transaction)))
  end

  @impl true
  def handle_event("validate", %{"transaction" => transaction_params}, socket) do
    # changeset = Ledger.change_transaction(socket.assigns.transaction, transaction_params)
    # {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
    # 1. Pegamos o ID da conta selecionada
    selected_account_id = transaction_params["account_id"]

    # 2. Verificamos se essa conta é do tipo virtual (Cartão de Crédito)
    # Você pode buscar na lista de contas que já está no socket
    is_credit? =
      case Enum.find(socket.assigns.accounts, &(&1.id == selected_account_id)) do
        %{type: :credit} -> true
        _ -> false
      end

    # 3. Atualizamos o socket com essa informação
    changeset =
      socket.assigns.transaction
      |> App.Ledger.change_transaction(transaction_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, changeset: changeset, is_credit: is_credit?)}
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

      {:error, changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp return_path("index", _transaction), do: ~p"/transactions"
  defp return_path("show", transaction), do: ~p"/transactions/#{transaction}"
end
