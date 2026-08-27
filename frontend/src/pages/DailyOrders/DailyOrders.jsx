import { useEffect, useState } from "react";
import "./DailyOrders.css";

import { obtenerPedidosDelDia } from "../../services/pedido.service";

export default function DailyOrders() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroRotiseria, setFiltroRotiseria] = useState("");

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const data = await obtenerPedidosDelDia();
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    }

    cargarPedidos();
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
          (pedido) => pedido.rotiserias?.nombre === filtroRotiseria
        );

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
          <h2>0</h2>
        </div>

        <div className="summary-card">
          <span>Rotiserías</span>
          <h2>
            {new Set(pedidos.map((pedido) => pedido.rotiseria_id)).size}
          </h2>
        </div>

      </div>

      <div className="pending-card">
        <h2>Usuarios pendientes</h2>

        <ul>
          <li>Juan Pérez</li>
          <li>María Gómez</li>
          <li>Pedro Ruiz</li>
          <li>Carlos Fernández</li>
          <li>Lucía Gómez</li>
          <li>Ana López</li>
        </ul>
      </div>

      <div className="tabs">
        <button
          className={filtroRotiseria === "" ? "active" : ""}
          onClick={() => setFiltroRotiseria("")}
        >
          Todas
        </button>

        {["Brisari", "Ensaladas", "Mary", "Saona"].map(
          (rotiseria) => (
            <button
              key={rotiseria}
              className={
                filtroRotiseria === rotiseria ? "active" : ""
              }
              onClick={() => setFiltroRotiseria(rotiseria)}
            >
              {rotiseria}
            </button>
          )
        )}
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