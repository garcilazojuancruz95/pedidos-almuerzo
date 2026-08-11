import { useEffect, useState } from "react";
import { obtenerUsuarios, cambiarEstadoUsuario, } from "../../services/usuario.service";
import "./Usuarios.css";


export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    }

    cargarUsuarios();
  }, []);

  async function cambiarEstado(usuario) {
    try {
      const usuarioActualizado = await cambiarEstadoUsuario(
        usuario.id,
        !usuario.activo
      );

        setUsuarios((usuariosActuales) =>
          usuariosActuales.map((u) =>
            u.id === usuario.id ? usuarioActualizado : u
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado del usuario.");
    }
  }

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de usuarios de la plataforma.</p>
        </div>

        <button className="usuarios-btn-nuevo">
          + Nuevo usuario
        </button>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Empresa</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>

                <td>{usuario.email}</td>

                <td>{usuario.empresas?.nombre || "-"}</td>

                <td>{usuario.roles?.nombre || "-"}</td>

                <td>
                  {usuario.activo ? "Activo" : "Inactivo"}
                </td>
                <td>
                  <button
                    onClick={() => cambiarEstado(usuario)}
                    className="usuarios-btn-estado"
                  >
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}