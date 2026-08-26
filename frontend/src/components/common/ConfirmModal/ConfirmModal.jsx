import "./ConfirmModal.css";

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!abierto) {
    return null;
  }

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>{titulo}</h2>

        <p>{mensaje}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-cancelar"
            onClick={onCancel}
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            className="confirm-modal-confirmar"
            onClick={onConfirm}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}