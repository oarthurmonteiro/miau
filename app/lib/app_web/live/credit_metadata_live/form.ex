defmodule AppWeb.CreditMetadataLive.Form do
  use AppWeb, :live_view

  alias App.Ledger
  alias App.Ledger.CreditMetadata

  @impl true
  def render(assigns) do
    ~H"""
    <Layouts.app flash={@flash}>
      <.header>
        {@page_title}
        <:subtitle>Use this form to manage credit_metadata records in your database.</:subtitle>
      </.header>

      <.form for={@form} id="credit_metadata-form" phx-change="validate" phx-submit="save">
        <.input field={@form[:total_installments]} type="number" label="Total installments" />
        <.input field={@form[:installment_number]} type="number" label="Installment number" />
        <footer>
          <.button phx-disable-with="Saving..." variant="primary">Save Credit metadata</.button>
          <.button navigate={return_path(@return_to, @credit_metadata)}>Cancel</.button>
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
    credit_metadata = Ledger.get_credit_metadata!(id)

    socket
    |> assign(:page_title, "Edit Credit metadata")
    |> assign(:credit_metadata, credit_metadata)
    |> assign(:form, to_form(Ledger.change_credit_metadata(credit_metadata)))
  end

  defp apply_action(socket, :new, _params) do
    credit_metadata = %CreditMetadata{}

    socket
    |> assign(:page_title, "New Credit metadata")
    |> assign(:credit_metadata, credit_metadata)
    |> assign(:form, to_form(Ledger.change_credit_metadata(credit_metadata)))
  end

  @impl true
  def handle_event("validate", %{"credit_metadata" => credit_metadata_params}, socket) do
    changeset = Ledger.change_credit_metadata(socket.assigns.credit_metadata, credit_metadata_params)
    {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end

  def handle_event("save", %{"credit_metadata" => credit_metadata_params}, socket) do
    save_credit_metadata(socket, socket.assigns.live_action, credit_metadata_params)
  end

  defp save_credit_metadata(socket, :edit, credit_metadata_params) do
    case Ledger.update_credit_metadata(socket.assigns.credit_metadata, credit_metadata_params) do
      {:ok, credit_metadata} ->
        {:noreply,
         socket
         |> put_flash(:info, "Credit metadata updated successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, credit_metadata))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp save_credit_metadata(socket, :new, credit_metadata_params) do
    case Ledger.create_credit_metadata(credit_metadata_params) do
      {:ok, credit_metadata} ->
        {:noreply,
         socket
         |> put_flash(:info, "Credit metadata created successfully")
         |> push_navigate(to: return_path(socket.assigns.return_to, credit_metadata))}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  defp return_path("index", _credit_metadata), do: ~p"/credit_metadata"
  defp return_path("show", credit_metadata), do: ~p"/credit_metadata/#{credit_metadata}"
end
