defmodule AppWeb.CreditCardLive.Form do
  use AppWeb, :live_view

  alias App.Credit
  alias App.Credit.CreditCard

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        {@page_title}
        <:subtitle>Use this form to manage credit_card records in your database.</:subtitle>
      </.header>

      <.form for={@form} id="credit_card-form" phx-change="validate" phx-submit="save">
        <.input field={@form[:name]} type="text" label="Name" />
        <.input field={@form[:limit]} type="number" label="Limit" step="any" />
        <.input field={@form[:due_day]} type="number" label="Due day" />
        <.input field={@form[:closing_day_offset]} type="number" label="Closing day offset" />
        <footer>
          <.button phx-disable-with="Saving..." variant="primary">Save Credit card</.button>
          <.button navigate={return_path(@return_to, @credit_card)}>Cancel</.button>
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
    credit_card = Credit.get_credit_card!(id)

    socket
    |> assign(:page_title, "Edit Credit card")
    |> assign(:credit_card, credit_card)
    |> assign(:form, to_form(Credit.change_credit_card(credit_card)))
  end

  defp apply_action(socket, :new, _params) do
    credit_card = %CreditCard{}

    socket
    |> assign(:page_title, "New Credit card")
    |> assign(:credit_card, credit_card)
    |> assign(:form, to_form(Credit.change_credit_card(credit_card)))
  end

  @impl true
  def handle_event("validate", %{"credit_card" => credit_card_params}, socket) do
    changeset = Credit.change_credit_card(socket.assigns.credit_card, credit_card_params)
    {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end

  def handle_event("save", %{"credit_card" => credit_card_params}, socket) do
    save_credit_card(socket, socket.assigns.live_action, credit_card_params)
  end

  defp save_credit_card(socket, :edit, credit_card_params) do
    case Credit.update_credit_card(socket.assigns.credit_card, credit_card_params) do
      {:ok, credit_card} ->
        {:noreply,
         socket
         |> put_flash(:info, "Credit card updated successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, credit_card))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp save_credit_card(socket, :new, credit_card_params) do
    case Credit.create_credit_card(credit_card_params) do
      {:ok, credit_card} ->
        {:noreply,
         socket
         |> put_flash(:info, "Cartão, Conta e Fatura criados!")
         |> push_navigate(to: return_path(socket.assigns.return_to, credit_card))}

      # Erro na validação da Conta Virtual
      {:error, :account, %Ecto.Changeset{} = changeset, _} ->
        {:noreply, assign(socket, form: to_form(changeset))}

      # Erro na validação do Cartão (ex: limite negativo, nome longo)
      {:error, :card, %Ecto.Changeset{} = changeset, _} ->
        {:noreply, assign(socket, form: to_form(changeset))}

      # Erro na Fatura
      {:error, :invoice, _changeset, _} ->
        {:noreply, put_flash(socket, :error, "Erro ao gerar fatura inicial")}

      {:error, step, value, _} ->
        IO.inspect(value, label: "Erro em #{step}")
        {:noreply, put_flash(socket, :error, "Falha ao processar operação")}
    end
  end

  defp return_path("index", _credit_card), do: ~p"/credit_cards"
  defp return_path("show", credit_card), do: ~p"/credit_cards/#{credit_card}"
end
