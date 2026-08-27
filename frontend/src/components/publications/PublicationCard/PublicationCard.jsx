import "./PublicationCard.css";

export default function PublicationCard({
  publicacion,
  rotiserias,
  estaEditando,
  edicion,
  onEditar,
  onCambioEdicion,
  onGuardar,
  onCancelar,
  onEliminar,
}) {
  return (
    <div className="publication-card">
      <div className="publication-top">
        {estaEditando ? (
          <select
            name="rotiseriaId"
            value={edicion.rotiseriaId}
            onChange={onCambioEdicion}
          >
            {rotiserias.map((rotiseria) => (
              <option key={rotiseria.id} value={rotiseria.id}>
                {rotiseria.nombre}
              </option>
            ))}
          </select>
        ) : (
          <h2>
            🍽 {publicacion.rotiserias?.nombre || "Sin rotisería"}
          </h2>
        )}

        <div className="actions">
          {estaEditando ? (
            <>
              <button
                type="button"
                onClick={() => onGuardar(publicacion.id)}
              >
                Guardar
              </button>

              <button
                type="button"
                onClick={onCancelar}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEditar(publicacion)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onEliminar(publicacion.id)}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {publicacion.publicacion_imagenes?.length > 0 && (
        <div className="publication-images">
          {publicacion.publicacion_imagenes
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((imagen) => (
              <img
                key={imagen.id}
                src={imagen.url}
                alt={`Menú de ${
                  publicacion.rotiserias?.nombre || "rotisería"
                }`}
              />
            ))}
        </div>
      )}

      <div className="publication-content">
        {estaEditando ? (
          <div className="publication-form-field">
            <label>Fecha</label>

            <input
              type="date"
              name="fecha"
              value={edicion.fecha}
              onChange={onCambioEdicion}
            />
          </div>
        ) : (
          <div className="publication-fecha">
            {new Date(
              `${publicacion.fecha}T00:00:00`
            ).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        )}

        {estaEditando ? (
          <div className="publication-form-field">
            <label>Menú</label>

            <textarea
              name="menuTexto"
              value={edicion.menuTexto}
              onChange={onCambioEdicion}
              rows="10"
            />
          </div>
        ) : (
          <div className="publication-menu">
            {publicacion.menu_texto}
          </div>
        )}

        {estaEditando ? (
          <div className="publication-form-field">
            <label>Aclaraciones</label>

            <textarea
              name="aclaraciones"
              value={edicion.aclaraciones}
              onChange={onCambioEdicion}
              rows="4"
            />
          </div>
        ) : (
          publicacion.aclaraciones && (
            <div className="publication-aclaraciones">
              <strong>Aclaraciones:</strong>

              <div>{publicacion.aclaraciones}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}