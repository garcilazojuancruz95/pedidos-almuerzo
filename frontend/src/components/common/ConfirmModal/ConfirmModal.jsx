import { AlertTriangle, CheckCircle2, TriangleAlert } from "lucide-react";
import "./ConfirmModal.css";

const ICONO_POR_TIPO = {
  error: AlertTriangle,
  exito: CheckCircle2,
  advertencia: TriangleAlert,
};

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  tipo,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!abierto) {
    return null;
  }

  const Icono = ICONO_POR_TIPO[tipo];

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div
          className={
            tipo
              ? `confirm-modal-titulo confirm-modal-titulo-${tipo}`
              : "confirm-modal-titulo"
          }
        >
          {Icono && (
            <Icono
              size={22}
              className="confirm-modal-icono"
              aria-hidden="true"
            />
          )}

          <h2>{titulo}</h2>
        </div>

        <p>{mensaje}</p>

        <div className="confirm-modal-actions">
          {textoCancelar && (
            <button
              type="button"
              className="confirm-modal-cancelar"
              onClick={onCancel}
            >
              {textoCancelar}
            </button>
          )}

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