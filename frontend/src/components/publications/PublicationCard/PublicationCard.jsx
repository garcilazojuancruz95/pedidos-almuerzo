import { useEffect, useState } from "react";
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
  onEliminarImagen,
  imagenesMarcadasEliminar,
  imagenesNuevasEdicion,
  onSeleccionarImagenes,
  onPegarImagenMenu,
  onQuitarImagenNueva,
}) {

  const [previsualizaciones, setPrevisualizaciones] = useState([]);

  useEffect(() => {
    const urls = imagenesNuevasEdicion.map((archivo) =>
      URL.createObjectURL(archivo)
    );

    setPrevisualizaciones(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagenesNuevasEdicion]);

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

      {(publicacion.publicacion_imagenes?.length > 0 ||
        (estaEditando && imagenesNuevasEdicion.length > 0)) && (
        <div className="publication-images">

          {publicacion.publicacion_imagenes
            ?.slice()
            .sort((a, b) => a.orden - b.orden)
            .map((imagen) => {
              const marcada =
                imagenesMarcadasEliminar.some(
                  (item) => item.id === imagen.id
                );

              if (marcada) {
                return null;
              }

              return (
                <div
                  className="publication-image-item"
                  key={imagen.id}
                >
                  <img
                    src={imagen.url}
                    alt={`Menú de ${
                      publicacion.rotiserias?.nombre ||
                      "rotisería"
                    }`}
                  />

                  {estaEditando && (
                    <button
                      type="button"
                      className="publication-image-delete"
                      onClick={() => onEliminarImagen(imagen)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              );
            })}

          {estaEditando &&
            imagenesNuevasEdicion.map((archivo, index) => (
              <div
                className="publication-image-item"
                key={`${archivo.name}-${index}`}
              >
                <img
                  src={previsualizaciones[index]}
                  alt={archivo.name}
                />

                <span className="publication-image-new">
                  Nueva
                </span>
              </div>
            ))}
        </div>
      )}

      {estaEditando && (
        <div className="publication-form-field">
          <label>Agregar imágenes</label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              onSeleccionarImagenes(Array.from(event.target.files));
              event.target.value = "";
            }}
          />
        </div>
      )}

      <div className="publication-content">
        <div className="publication-fecha">
          {new Date(
            `${publicacion.fecha}T00:00:00`
          ).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>

        {estaEditando ? (
          <div className="publication-form-field">
            <label>Menú</label>

            <textarea
              name="menuTexto"
              value={edicion.menuTexto}
              onChange={onCambioEdicion}
              onPaste={onPegarImagenMenu}
              rows="10"
              placeholder="Escribí el menú o pegá una imagen (Ctrl+V)"
            />

            {previsualizaciones.length > 0 && (
              <div className="publication-menu-previews">
                {previsualizaciones.map((url, index) => (
                  <div
                    key={index}
                    className="publication-menu-preview-item"
                  >
                    <img
                      src={url}
                      alt="Imagen pegada"
                      className="publication-menu-preview"
                    />

                    <button
                      type="button"
                      className="publication-menu-preview-quitar"
                      onClick={() => onQuitarImagenNueva(index)}
                      aria-label="Quitar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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