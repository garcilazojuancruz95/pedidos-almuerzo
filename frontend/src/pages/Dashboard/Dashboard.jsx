import { useEffect, useState } from "react";

import {
  obtenerPublicaciones,
  obtenerRotiserias,
} from "../../services/publicacion.service";
import { obtenerPedidosDelDia } from "../../services/pedido.service";
import { obtenerUsuarios } from "../../services/usuario.service";

import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { usuario } = useAuth();

  const [publicaciones, setPublicaciones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [rotiserias, setRotiserias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDashboard() {
      try {
        const [
          publicacionesData,
          pedidosData,
          usuariosData,
          rotiseriasData,
        ] = await Promise.all([
          obtenerPublicaciones(),
          obtenerPedidosDelDia(),
          obtenerUsuarios(),
          obtenerRotiserias(),
        ]);

        setPublicaciones(publicacionesData);
        setPedidos(pedidosData);
        setRotiserias(rotiseriasData);

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
          "Error al cargar dashboard:",
          error
        );

        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    cargarDashboard();
  }, []);

  if (loading) {
    return <p>Cargando dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <p className="page-subtitle">
        Bienvenido, {usuario?.nombre || "usuario"}.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Publicaciones</h3>
          <h1>{publicaciones.length}</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Pedidos</h3>
          <h1>{pedidos.length}</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Pendientes</h3>
          <h1>{usuariosPendientes.length}</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Rotiserías</h3>
          <h1>{rotiserias.length}</h1>
        </div>
      </div>
    </div>
  );
}