defmodule AppWeb.Ledger.AccountLive.Form do
  use AppWeb, :live_view

  alias App.Ledger
  alias App.Ledger.Account

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        {@page_title}
        <:subtitle>Use this form to manage account records in your database.</:subtitle>
      </.header>

      <.form for={@form} id="account-form" phx-change="validate" phx-submit="save">
        <.input field={@form[:name]} type="text" label="Name" />
        <.input field={@form[:initial_balance]} type="number" label="Initial balance" step="any" />
        <footer>
          <.button phx-disable-with="Saving..." variant="primary">Save Account</.button>
          <.button navigate={return_path(@return_to, @account)}>Cancel</.button>
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
    account = Ledger.get_account!(id)

    socket
    |> assign(:page_title, "Edit Account")
    |> assign(:account, account)
    |> assign(:form, to_form(Ledger.change_account(account)))
  end

  defp apply_action(socket, :new, _params) do
    account = %Account{}

    socket
    |> assign(:page_title, "New Account")
    |> assign(:account, account)
    |> assign(:form, to_form(Ledger.change_account(account)))
  end

  @impl true
  def handle_event("validate", %{"account" => account_params}, socket) do
    changeset = Ledger.change_account(socket.assigns.account, account_params)
    {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end

  def handle_event("save", %{"account" => account_params}, socket) do
    save_account(socket, socket.assigns.live_action, account_params)
  end

  defp save_account(socket, :edit, account_params) do
    case Ledger.update_account(socket.assigns.account, account_params) do
      {:ok, account} ->
        {:noreply,
         socket
         |> put_flash(:info, "Account updated successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, account))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp save_account(socket, :new, account_params) do
    case Ledger.create_account(account_params) do
      {:ok, account} ->
        {:noreply,
         socket
         |> put_flash(:info, "Account created successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, account))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp return_path("index", _account), do: ~p"/ledger/accounts"
  defp return_path("show", account), do: ~p"/ledger/accounts/#{account}"
end
