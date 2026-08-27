import { useEffect, useState } from "react";
import "./MyOrder.css";

import { obtenerPublicaciones } from "../../services/publicacion.service";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerUsuarioPorAuthId } from "../../services/usuario.service";
import { crearPedido } from "../../services/pedido.service";

export default function MyOrder() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [pedidos, setPedidos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { session } = useAuth();

  async function manejarCrearPedido(publicacionId) {
    const textoPedido = pedidos[publicacionId]?.trim();

    if (!textoPedido) {
      return;
    }

    try {
      const usuario = await obtenerUsuarioPorAuthId(session.user.id);

      if (!usuario) {
        throw new Error("No se encontró el usuario de la plataforma.");
      }

      const publicacion = publicaciones.find(
        (item) => item.id === publicacionId
      );

      if (!publicacion) {
        throw new Error("No se encontró la publicación.");
      }

      await crearPedido({
        usuarioId: usuario.id,
        rotiseriaId: publicacion.rotiseria_id,
        pedido: textoPedido,
      });

      setPedidos((actuales) => ({
        ...actuales,
        [publicacionId]: "",
      }));

      alert("Pedido enviado correctamente.");
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert("No se pudo enviar el pedido.");
    }
  }

  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const data = await obtenerPublicaciones();
        setPublicaciones(data);

        const pedidosIniciales = {};

        data.forEach((publicacion) => {
          pedidosIniciales[publicacion.id] = "";
        });

        setPedidos(pedidosIniciales);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
        setError("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    }

    cargarPublicaciones();
  }, []);

  function manejarCambioPedido(publicacionId, valor) {
    setPedidos((actuales) => ({
      ...actuales,
      [publicacionId]: valor,
    }));
  }

  if (loading) {
    return <p>Cargando publicaciones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="my-order">
      <div className="page-header">
        <h1>Mi pedido</h1>
      </div>

      {publicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles para hoy.</p>
      ) : (
        <div className="my-order-publications">
          {publicaciones.map((publicacion) => (
            <div
              className="my-order-card"
              key={publicacion.id}
            >
              <div className="my-order-header">
                <h2>
                  🍽{" "}
                  {publicacion.rotiserias?.nombre ||
                    "Sin rotisería"}
                </h2>

                <div className="my-order-fecha">
                  {new Date(
                    `${publicacion.fecha}T00:00:00`
                  ).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>

              {publicacion.publicacion_imagenes?.length > 0 && (
                <div className="my-order-images">
                  {publicacion.publicacion_imagenes
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map((imagen) => (
                      <img
                        key={imagen.id}
                        src={imagen.url}
                        alt={`Menú de ${
                          publicacion.rotiserias?.nombre ||
                          "rotisería"
                        }`}
                      />
                    ))}
                </div>
              )}

              {publicacion.menu_texto && (
                <div className="my-order-menu">
                  {publicacion.menu_texto}
                </div>
              )}

              {publicacion.aclaraciones && (
                <div className="my-order-aclaraciones">
                  <strong>Aclaraciones:</strong>

                  <div>{publicacion.aclaraciones}</div>
                </div>
              )}

              <div className="my-order-form">
                <label htmlFor={`pedido-${publicacion.id}`}>
                  ¿Qué querés pedir?
                </label>

                <textarea
                  id={`pedido-${publicacion.id}`}
                  value={pedidos[publicacion.id] || ""}
                  onChange={(event) =>
                    manejarCambioPedido(
                      publicacion.id,
                      event.target.value
                    )
                  }
                  rows="4"
                  placeholder="Escribí tu pedido..."
                />

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => manejarCrearPedido(publicacion.id)}
                >
                  Pedir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}