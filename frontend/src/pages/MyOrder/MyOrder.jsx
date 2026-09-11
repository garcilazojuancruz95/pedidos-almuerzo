import { useEffect, useState } from "react";
import "./MyOrder.css";

import { obtenerPublicaciones } from "../../services/publicacion.service";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerUsuarioPorAuthId } from "../../services/usuario.service";
import {
  estaEnHomeOffice,
} from "../../services/home-office.service";
import {
  crearPedido,
  obtenerMisPedidosDelDia,
  actualizarPedido,
  eliminarPedido,
  haPasadoHoraLimitePedidos,
} from "../../services/pedido.service";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import ImageViewer from "../../components/common/ImageViewer/ImageViewer";

export default function MyOrder() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [pedidos, setPedidos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalConfirmarPedido, setModalConfirmarPedido] = useState(false);
  const [modalPedidoExitoso, setModalPedidoExitoso] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [pedidoAEnviar, setPedidoAEnviar] = useState(null);
  const [nombreRotiseriaPedido, setNombreRotiseriaPedido] = useState("");
  const { session } = useAuth();
  const [misPedidos, setMisPedidos] = useState([]);
  const [editandoPedidoId, setEditandoPedidoId] = useState(null);
  const [textoEdicionPedido, setTextoEdicionPedido] = useState("");
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
  const [enHomeOffice, setEnHomeOffice] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [modalConfirmarEdicion, setModalConfirmarEdicion] =
    useState(false);
  const [modalEliminarPedido, setModalEliminarPedido] =
    useState(false);
  const [horarioLimiteVencido, setHorarioLimiteVencido] = useState(
    haPasadoHoraLimitePedidos()
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHorarioLimiteVencido(haPasadoHoraLimitePedidos());
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  async function confirmarEdicionPedido() {
    if (!editandoPedidoId) {
      return;
    }

    if (horarioLimiteVencido) {
      return;
    }

    const texto = textoEdicionPedido.trim();

    if (!texto) {
      return;
    }

    try {
      const pedidoActualizado = await actualizarPedido(
        editandoPedidoId,
        texto
      );

      setMisPedidos((actuales) =>
        actuales.map((pedido) =>
          pedido.id === editandoPedidoId
            ? pedidoActualizado
            : pedido
        )
      );

      setEditandoPedidoId(null);
      setTextoEdicionPedido("");

      setModalConfirmarEdicion(false);
    } catch (error) {
      console.error("Error al actualizar pedido:", error);

      mostrarMensaje?.(
        "Error al actualizar pedido",
        "No se pudo actualizar el pedido."
      );
    }
  }

  async function manejarCrearPedido() {
    if (!pedidoAEnviar) {
      return;
    }

    if (horarioLimiteVencido) {
      setModalConfirmarPedido(false);
      setPedidoAEnviar(null);
      return;
    }

    if (enHomeOffice) {
      setModalConfirmarPedido(false);
      setPedidoAEnviar(null);
      return;
    }

    try {
      const usuario = await obtenerUsuarioPorAuthId(session.user.id);

      if (!usuario) {
        throw new Error(
          "No se encontró el usuario de la plataforma."
        );
      }

      const homeOffice = await estaEnHomeOffice(usuario.id);

        setEnHomeOffice(homeOffice);

      const publicacion = publicaciones.find(
        (item) => item.id === pedidoAEnviar.publicacionId
      );

      if (!publicacion) {
        throw new Error("No se encontró la publicación.");
      }

      const pedidoCreado = await crearPedido({
        usuarioId: usuario.id,
        rotiseriaId: publicacion.rotiseria_id,
        pedido: pedidoAEnviar.textoPedido,
      });

      setMisPedidos((actuales) => [
        ...actuales,
        pedidoCreado,
      ]);

      setPedidos((actuales) => ({
        ...actuales,
        [pedidoAEnviar.publicacionId]: "",
      }));

      setModalConfirmarPedido(false);
      setPedidoAEnviar(null);
    } catch (error) {
      console.error("Error al crear pedido:", error);

      setModalConfirmarPedido(false);
      setPedidoAEnviar(null);

      setModalMensaje(
        "No se pudo enviar el pedido."
      );
    }
  }

  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerPublicaciones();
        setPublicaciones(data);

        const pedidosIniciales = {};

        data.forEach((publicacion) => {
          pedidosIniciales[publicacion.id] = "";
        });

        setPedidos(pedidosIniciales);

        const usuario = await obtenerUsuarioPorAuthId(
          session.user.id
        );

        if (!usuario) {
          throw new Error(
            "No se encontró el usuario de la plataforma."
          );
        }

        const homeOffice = await estaEnHomeOffice(usuario.id);

        setEnHomeOffice(homeOffice);

        const pedidosUsuario =
          await obtenerMisPedidosDelDia(usuario.id);

        setMisPedidos(pedidosUsuario);

      } catch (error) {
        console.error("Error al cargar Mi pedido:", error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  useEffect(() => {
    function manejarCambioHomeOffice(event) {
      setEnHomeOffice(event.detail);
    }

    window.addEventListener(
      "homeOfficeChanged",
      manejarCambioHomeOffice
    );

    return () => {
      window.removeEventListener(
        "homeOfficeChanged",
        manejarCambioHomeOffice
      );
    };
  }, []);

  async function confirmarEliminarPedido() {
    if (!pedidoAEliminar) {
      return;
    }

    if (horarioLimiteVencido) {
      setModalEliminarPedido(false);
      setPedidoAEliminar(null);
      return;
    }

    try {
      await eliminarPedido(pedidoAEliminar.id);

      setMisPedidos((actuales) =>
        actuales.filter(
          (pedido) => pedido.id !== pedidoAEliminar.id
        )
      );

      setModalEliminarPedido(false);
      setPedidoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar pedido:", error);

      setModalEliminarPedido(false);
      setPedidoAEliminar(null);

      setModalMensaje(
        "No se pudo eliminar el pedido."
      );
    }
  }

  function solicitarEliminarPedido(pedido) {
    setPedidoAEliminar(pedido);
    setModalEliminarPedido(true);
  }

  function solicitarCrearPedido(publicacion) {
    const textoPedido = pedidos[publicacion.id]?.trim();

    if (!textoPedido) {
      setModalMensaje("Escribí qué querés pedir antes de continuar.");
      setModalConfirmarPedido(false);
      return;
    }

    setPedidoAEnviar({
      publicacionId: publicacion.id,
      textoPedido,
    });

    setNombreRotiseriaPedido(
      publicacion.rotiserias?.nombre || "esta rotisería"
    );

    setModalConfirmarPedido(true);
  }

  function comenzarEdicionPedido(pedido) {
    setEditandoPedidoId(pedido.id);
    setTextoEdicionPedido(pedido.pedido);
  }

  function cancelarEdicionPedido() {
    setEditandoPedidoId(null);
    setTextoEdicionPedido("");
  }

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
        <h1 className="page-title">Mi pedido</h1>
      </div>

        {misPedidos.length > 0 && (
          <div className="my-orders-today">
            <h2>Mis pedidos de hoy</h2>

            {misPedidos.map((pedido) => (
              <div
                className="my-order-existing"
                key={pedido.id}
              >
                <div className="my-order-existing-header">
                  <h3>
                    🍽{" "}
                    {pedido.rotiserias?.nombre || "Sin rotisería"}
                  </h3>

                  <div className="my-order-existing-actions">
                    <button
                      type="button"
                      disabled={horarioLimiteVencido}
                      onClick={() => comenzarEdicionPedido(pedido)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      disabled={horarioLimiteVencido}
                      onClick={() => solicitarEliminarPedido(pedido)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {editandoPedidoId === pedido.id ? (
                  <div className="my-order-edit">
                    <textarea
                      value={textoEdicionPedido}
                      onChange={(event) =>
                        setTextoEdicionPedido(
                          event.target.value
                        )
                      }
                      rows="4"
                    />

                    <div className="my-order-edit-actions">
                      <button
                        type="button"
                        onClick={cancelarEdicionPedido}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                          setModalConfirmarEdicion(true)
                        }
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-order-existing-text">
                    {pedido.pedido}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {publicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles para hoy.</p>
      ) : (
        <div className="my-order-publications">
          {publicaciones.map((publicacion) => {
            const imagenes = (
              publicacion.publicacion_imagenes || []
            )
              .slice()
              .sort((a, b) => a.orden - b.orden);

            return (
            <div
              className="my-order-card"
              key={publicacion.id}
            >
              {imagenes.length > 0 && (
                <div className="my-order-thumbnails">
                  {imagenes.map((imagen) => (
                    <div
                      className="my-order-thumbnail"
                      key={imagen.id}
                      onClick={() =>
                        setImagenAmpliada(imagen.url)
                      }
                    >
                      <img
                        src={imagen.url}
                        alt={`Menú de ${
                          publicacion.rotiserias?.nombre ||
                          "rotisería"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

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

                {enHomeOffice && (
                  <p className="home-office-message">
                    Estás marcado como Home Office. Desmarcá "Estoy en casa" para realizar un pedido.
                  </p>
                )}

                {!enHomeOffice && horarioLimiteVencido && (
                  <p className="home-office-message">
                    El horario para realizar pedidos (hasta las 11:15) ya finalizó.
                  </p>
                )}

                <button
                  type="button"
                  className="btn-primary"
                  disabled={enHomeOffice || horarioLimiteVencido}
                  onClick={() => solicitarCrearPedido(publicacion)}
                >
                  Pedir
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <ImageViewer
        src={imagenAmpliada}
        alt="Menú ampliado"
        onClose={() => setImagenAmpliada(null)}
      />
      <ConfirmModal
        abierto={modalConfirmarPedido}
        titulo="Enviar pedido"
        mensaje="¿Confirmar pedido?"
        textoConfirmar="Aceptar"
        textoCancelar="Cancelar"
        onConfirm={manejarCrearPedido}
        onCancel={() => {
          setModalConfirmarPedido(false);
          setPedidoAEnviar(null);
        }}
      />

      <ConfirmModal
        abierto={modalPedidoExitoso}
        titulo={
          modalMensaje
            ? "No se pudo enviar"
            : "Pedido enviado"
        }
        mensaje={
          modalMensaje ||
          `Tu pedido a ${nombreRotiseriaPedido} fue enviado correctamente.`
        }
        textoConfirmar="Entendido"
        textoCancelar=""
        onConfirm={() => {
          setModalPedidoExitoso(false);
          setModalMensaje("");
        }}
        onCancel={() => {
          setModalPedidoExitoso(false);
          setModalMensaje("");
        }}
      />

      <ConfirmModal
        abierto={modalConfirmarEdicion}
        titulo="Guardar cambios"
        mensaje="¿Querés guardar los cambios realizados en este pedido?"
        textoConfirmar="Guardar cambios"
        textoCancelar="Cancelar"
        onConfirm={confirmarEdicionPedido}
        onCancel={() =>
          setModalConfirmarEdicion(false)
        }
      />

      <ConfirmModal
        abierto={modalEliminarPedido}
        titulo="Eliminar pedido"
        mensaje="¿Estás seguro de que querés eliminar este pedido?"
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirm={confirmarEliminarPedido}
        onCancel={() => {
          setModalEliminarPedido(false);
          setPedidoAEliminar(null);
        }}
      />
    </div>
  );
}