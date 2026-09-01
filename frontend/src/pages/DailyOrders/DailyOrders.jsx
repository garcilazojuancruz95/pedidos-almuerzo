import { useEffect, useState } from "react";
import "./DailyOrders.css";

import {
  obtenerPedidosDelDia,
  crearPedido,
} from "../../services/pedido.service";

import {
  obtenerUsuarios,
} from "../../services/usuario.service";

import { obtenerPublicaciones } from "../../services/publicacion.service";

export default function DailyOrders() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroRotiseria, setFiltroRotiseria] = useState("");
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);

  const [mostrarFormularioPedido, setMostrarFormularioPedido] =
    useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [publicacionSeleccionada, setPublicacionSeleccionada] =
    useState("");
  const [textoPedido, setTextoPedido] = useState("");

  async function guardarPedidoOperador() {
    if (!usuarioSeleccionado) {
      alert("Seleccioná un empleado.");
      return;
    }

    if (!publicacionSeleccionada) {
      alert("Seleccioná un menú.");
      return;
    }

    if (!textoPedido.trim()) {
      alert("Escribí el pedido.");
      return;
    }

    try {
      const publicacion = publicaciones.find(
        (item) => item.id === publicacionSeleccionada
      );

      if (!publicacion) {
        throw new Error("No se encontró el menú seleccionado.");
      }

      await crearPedido({
        usuarioId: usuarioSeleccionado,
        rotiseriaId: publicacion.rotiseria_id,
        pedido: textoPedido.trim(),
      });

      const pedidosActualizados = await obtenerPedidosDelDia();

      setPedidos(pedidosActualizados);

      setMostrarFormularioPedido(false);
      setUsuarioSeleccionado("");
      setPublicacionSeleccionada("");
      setTextoPedido("");

      alert("Pedido cargado correctamente.");
    } catch (error) {
      console.error("Error al cargar pedido:", error);
      alert("No se pudo cargar el pedido.");
    }
  }

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [
          pedidosData,
          usuariosData,
          publicacionesData,
        ] = await Promise.all([
          obtenerPedidosDelDia(),
          obtenerUsuarios(),
          obtenerPublicaciones(),
        ]);

        setPedidos(pedidosData);
        setUsuarios(usuariosData);
        setPublicaciones(publicacionesData);

        const empleadosActivos = usuariosData.filter(
          (usuario) =>
            usuario.activo &&
            usuario.roles?.nombre === "Empleado"
        );

        const usuariosConPedido = new Set(
          pedidosData.map((pedido) => pedido.usuario_id)
        );

        const pendientes = empleadosActivos.filter(
          (empleado) => !usuariosConPedido.has(empleado.id)
        );

        setUsuariosPendientes(pendientes);
      } catch (error) {
        console.error(
          "Error al cargar pedidos y usuarios:",
          error
        );

        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const pedidosFiltrados =
    filtroRotiseria === ""
      ? pedidos
      : pedidos.filter(
          (pedido) => pedido.rotiseria_id === filtroRotiseria
        );
    
  const rotiseriasFiltradas = [
    ...new Map(
      pedidos.map((pedido) => [
        pedido.rotiseria_id,
        {
          id: pedido.rotiseria_id,
          nombre:
            pedido.rotiserias?.nombre || "Sin rotisería",
        },
      ])
    ).values(),
  ];

  const pedidosAgrupados =
    filtroRotiseria === ""
      ? [
          {
            id: "todas",
            nombre: "Todos los pedidos",
            pedidos: pedidosFiltrados,
          },
        ]
      : rotiseriasFiltradas
          .filter(
            (rotiseria) => rotiseria.id === filtroRotiseria
          )
          .map((rotiseria) => ({
            ...rotiseria,
            pedidos: pedidosFiltrados.filter(
              (pedido) =>
                pedido.rotiseria_id === rotiseria.id
            ),
          }));

  return (
    <div className="daily-orders">

      <div className="page-header">
        <h1>Pedidos del día</h1>

        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setMostrarFormularioPedido(true)}
          >
            + Cargar pedido
          </button>

          <button className="btn-primary">Exportar Excel</button>
          <button className="btn-primary">Imprimir</button>
        </div>
      </div>

      {mostrarFormularioPedido && (
        <div className="order-form-card">
          <h2>Cargar pedido</h2>

          <div className="order-form-field">
            <label>Empleado</label>

            <select
              value={usuarioSeleccionado}
              onChange={(event) =>
                setUsuarioSeleccionado(event.target.value)
              }
            >
              <option value="">Seleccionar empleado</option>

              {usuarios
                .filter(
                  (usuario) =>
                    usuario.activo &&
                    usuario.roles?.nombre === "Empleado"
                )
                .map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
            </select>
          </div>

          <div className="order-form-field">
            <label>Menú</label>

            <select
              value={publicacionSeleccionada}
              onChange={(event) =>
                setPublicacionSeleccionada(event.target.value)
              }
            >
              <option value="">Seleccionar menú</option>

              {publicaciones.map((publicacion) => (
                <option
                  key={publicacion.id}
                  value={publicacion.id}
                >
                  {publicacion.rotiserias?.nombre || "Sin rotisería"}
                </option>
              ))}
            </select>
          </div>

          <div className="order-form-field">
            <label>Pedido</label>

            <textarea
              value={textoPedido}
              onChange={(event) =>
                setTextoPedido(event.target.value)
              }
              rows="5"
              placeholder="Escribí el pedido del empleado..."
            />
          </div>

          <div className="order-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setMostrarFormularioPedido(false);
                setUsuarioSeleccionado("");
                setPublicacionSeleccionada("");
                setTextoPedido("");
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={guardarPedidoOperador}
            >
              Cargar pedido
            </button>
          </div>
        </div>
      )}

      <div className="summary">
        <div className="summary-card">
          <span>Pedidos</span>
          <h2>{pedidos.length}</h2>
        </div>

        <div className="summary-card">
          <span>Pendientes</span>
          <h2>{usuariosPendientes.length}</h2>
        </div>

        <div className="summary-card">
          <span>Rotiserías</span>
          <h2>
            {new Set(
              pedidos.map((pedido) => pedido.rotiseria_id)
            ).size}
          </h2>
        </div>
      </div>

      {usuariosPendientes.length > 0 && (
        <div className="pending-card">
          <h2>Usuarios pendientes</h2>

          <ul>
            {usuariosPendientes.map((usuario) => (
              <li key={usuario.id}>
                {usuario.nombre} {usuario.apellido}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tabs">
        <button
          className={filtroRotiseria === "" ? "active" : ""}
          onClick={() => setFiltroRotiseria("")}
        >
          Todas
        </button>

        {rotiseriasFiltradas.map((rotiseria) => (
          <button
            key={rotiseria.id}
            className={
              filtroRotiseria === rotiseria.id
                ? "active"
                : ""
            }
            onClick={() =>
              setFiltroRotiseria(rotiseria.id)
            }
          >
            {rotiseria.nombre}
          </button>
        ))}
      </div>

      <div className="orders-groups">
        {pedidosAgrupados.map((rotiseria) => (
          <div className="order-group" key={rotiseria.id}>
            <h2>{rotiseria.nombre}</h2>

            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Usuario</th>
                  <th>Pedido</th>
                </tr>
              </thead>

              <tbody>
                {rotiseria.pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      {pedido.usuarios?.empresas?.nombre ||
                        "Sin empresa"}
                    </td>

                    <td>
                      {pedido.usuarios
                        ? `${pedido.usuarios.nombre} ${pedido.usuarios.apellido}`
                        : "Sin usuario"}
                    </td>

                    <td>{pedido.pedido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

    </div>
  );
}