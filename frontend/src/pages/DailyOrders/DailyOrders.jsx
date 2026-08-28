import { useEffect, useState } from "react";
import "./DailyOrders.css";

import { obtenerPedidosDelDia } from "../../services/pedido.service";
import { obtenerUsuarios } from "../../services/usuario.service";

export default function DailyOrders() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroRotiseria, setFiltroRotiseria] = useState("");
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [pedidosData, usuariosData] = await Promise.all([
          obtenerPedidosDelDia(),
          obtenerUsuarios(),
        ]);

        setPedidos(pedidosData);

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

  return (
    <div className="daily-orders">

      <div className="page-header">
        <h1>Pedidos del día</h1>

        <div className="header-actions">
          <button className="btn-primary">Exportar Excel</button>
          <button className="btn-primary">Imprimir</button>
        </div>
      </div>

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

      <table>

        <thead>
          <tr>
            <th>Empresa</th>
            <th>Usuario</th>
            <th>Rotisería</th>
            <th>Pedido</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                {pedido.usuarios?.empresas?.nombre || "Sin empresa"}
              </td>

              <td>
                {pedido.usuarios
                  ? `${pedido.usuarios.nombre} ${pedido.usuarios.apellido}`
                  : "Sin usuario"}
              </td>

              <td>
                {pedido.rotiserias?.nombre || "Sin rotisería"}
              </td>

              <td>
                {pedido.pedido}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}