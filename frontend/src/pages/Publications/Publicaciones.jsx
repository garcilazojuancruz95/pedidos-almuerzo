import { useEffect, useState } from "react";
import "./Publicaciones.css";

import { obtenerPublicaciones } from "../../services/publicacion.service";

export default function Publications() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const data = await obtenerPublicaciones();
        setPublicaciones(data);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
        setError("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    }

    cargarPublicaciones();
  }, []);

  if (loading) {
    return <p>Cargando publicaciones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="publications">
      <div className="page-header">
        <h1>Publicaciones del día</h1>

        <button className="btn-primary">
          + Nueva publicación
        </button>
      </div>

      {publicaciones.length === 0 ? (
        <p>No hay publicaciones cargadas.</p>
      ) : (
        publicaciones.map((publicacion) => (
          <div
            className="publication-card"
            key={publicacion.id}
          >
            <div className="publication-top">
              <h2>
                🍽 {publicacion.rotiserias?.nombre || "Sin rotisería"}
              </h2>

              <div className="actions">
                <button>Editar</button>
                <button>Eliminar</button>
              </div>
            </div>

            {publicacion.publicacion_imagenes?.length > 0 && (
              <div className="publication-images">
                {publicacion.publicacion_imagenes
                  .sort((a, b) => a.orden - b.orden)
                  .map((imagen) => (
                    <img
                      key={imagen.id}
                      src={imagen.url}
                      alt={`Menú de ${publicacion.rotiserias?.nombre || "rotisería"}`}
                    />
                  ))}
              </div>
            )}

            <div className="publication-content">
              <p>{publicacion.menu_texto}</p>

              {publicacion.aclaraciones && (
                <p className="publication-aclaraciones">
                  {publicacion.aclaraciones}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}