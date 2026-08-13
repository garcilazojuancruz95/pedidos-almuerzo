import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  obtenerUsuarios,
  cambiarEstadoUsuario,
  importarEmpleado,
  obtenerEmpresas,
  obtenerRoles,
  crearUsuario,
  actualizarUsuario,
} from "../../services/usuario.service";
import "./Usuarios.css";
import * as XLSX from "xlsx";

export default function Usuarios() {
  const { session } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [edicion, setEdicion] = useState({
    nombre: "",
    apellido: "",
    email: "",
    empresaId: "",
    rolId: "",
    activo: true,
  });

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    empresaId: "",
    rolId: "",
  });

  const [filtros, setFiltros] = useState({
    nombre: "",
    email: "",
    empresa: "",
    rol: "",
    estado: "",
  });

  const [orden, setOrden] = useState({
    campo: "nombre",
    direccion: "asc",
  });

  function comenzarEdicion(usuario) {
    setEditandoId(usuario.id);

    setEdicion({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      email: usuario.email || "",
      empresaId: usuario.empresa_id || "",
      rolId: usuario.rol_id || "",
      activo: usuario.activo,
    });
  }

  
  function manejarCambioEdicion(event) {
    const { name, value } = event.target;
    
    setEdicion((actual) => ({
      ...actual,
      [name]: value,
    }));
  }
  
  function cambiarFiltro(campo, valor) {
    setFiltros((actuales) => ({
      ...actuales,
      [campo]: valor,
    }));
  }

  function cambiarOrden(campo) {
    setOrden((actual) => {
      if (actual.campo === campo) {
        return {
          campo,
          direccion: actual.direccion === "asc" ? "desc" : "asc",
        };
      }

      return {
        campo,
        direccion: "asc",
      };
    });
  }

  async function guardarEdicion(usuarioId) {
    try {
      const usuarioActualizado = await actualizarUsuario(
        usuarioId,
        {
          ...edicion,
          activo: edicion.activo === true || edicion.activo === "true",
        }
      );

      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((usuario) =>
          usuario.id === usuarioId
            ? usuarioActualizado
            : usuario
        )
      );

      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("No se pudo actualizar el usuario.");
    }
  }

  function cancelarEdicion() {
    setEditandoId(null);
  }

  function manejarCambioFormulario(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function manejarCrearUsuario(event) {
    event.preventDefault();

    try {
      await crearUsuario({
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        empresaId: formulario.empresaId,
        rolId: formulario.rolId,
      });

      const usuariosActualizados = await obtenerUsuarios();
      setUsuarios(usuariosActualizados);

      setFormulario({
        nombre: "",
        apellido: "",
        email: "",
        empresaId: "",
        rolId: "",
      });

      setMostrarFormulario(false);

      alert("Empleado creado correctamente.");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("No se pudo crear el empleado.");
    }
  }

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [usuariosData, empresasData, rolesData] = await Promise.all([
          obtenerUsuarios(),
          obtenerEmpresas(),
          obtenerRoles(),
        ]);

        setUsuarios(usuariosData);
        setEmpresas(empresasData);
        setRoles(rolesData);

        const usuarioLogueado = usuariosData.find(
          (usuario) => usuario.auth_user_id === session?.user?.id
        );

        setUsuarioActual(usuarioLogueado);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [session]);

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

  async function manejarImportacion(event) {
    const archivo = event.target.files[0];

    if (!archivo) {
      return;
    }

    try {
      const buffer = await archivo.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];

      const filas = XLSX.utils.sheet_to_json(hoja);

      console.log("Filas encontradas:", filas);

      for (const fila of filas) {
        await importarEmpleado({
          peopleforce_id: fila["PeopleForce ID"],
          nombre: fila["Nombres"],
          apellido: fila["Apellidos"],
          email: fila["Correo"],
          division: fila["División"],
        });
      }

      const usuariosActualizados = await obtenerUsuarios();
      setUsuarios(usuariosActualizados);

      alert("Nómina importada correctamente.");
    } catch (error) {
      console.error("Error al importar nómina:", error);
      alert("Ocurrió un error al importar la nómina.");
    }

    event.target.value = "";
  }

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const usuariosFiltrados = usuarios
    .filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombre || ""} ${usuario.apellido || ""}`.toLowerCase();

      const email =
        (usuario.email || "").toLowerCase();

      const empresa =
        (usuario.empresas?.nombre || "").toLowerCase();

      const rol =
        (usuario.roles?.nombre || "").toLowerCase();

      const estado =
        usuario.activo ? "activo" : "inactivo";

      return (
        nombreCompleto.includes(filtros.nombre.toLowerCase()) &&
        email.includes(filtros.email.toLowerCase()) &&
        (!filtros.empresa || empresa === filtros.empresa.toLowerCase()) &&
        (!filtros.rol || rol === filtros.rol.toLowerCase()) &&
        (!filtros.estado || estado === filtros.estado.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valorA;
      let valorB;

      switch (orden.campo) {
        case "nombre":
          valorA = `${a.nombre || ""} ${a.apellido || ""}`;
          valorB = `${b.nombre || ""} ${b.apellido || ""}`;
          break;

        case "email":
          valorA = a.email || "";
          valorB = b.email || "";
          break;

        case "empresa":
          valorA = a.empresas?.nombre || "";
          valorB = b.empresas?.nombre || "";
          break;

        case "rol":
          valorA = a.roles?.nombre || "";
          valorB = b.roles?.nombre || "";
          break;

        case "estado":
          valorA = a.activo ? "Activo" : "Inactivo";
          valorB = b.activo ? "Activo" : "Inactivo";
          break;

        default:
          return 0;
      }

      const resultado = valorA.localeCompare(
        valorB,
        "es",
        { sensitivity: "base" }
      );

      return orden.direccion === "asc"
        ? resultado
        : -resultado;
    });

    const esAdministrador =
      usuarioActual?.roles?.nombre === "Administrador";

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de usuarios de la plataforma.</p>
        </div>

        <div className="usuarios-header-actions">
          {esAdministrador && (
            <label className="usuarios-btn-importar">
              Importar nómina
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={manejarImportacion}
                style={{ display: "none" }}
              />
            </label>
          )}

          <button
            className="usuarios-btn-nuevo"
            onClick={() => setMostrarFormulario(true)}
          >
            + Nuevo empleado
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="usuarios-form-container">
          <h2>Nuevo empleado</h2>

          <form onSubmit={manejarCrearUsuario}>
            <div className="usuarios-form-grid">

              <div className="usuarios-form-field">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambioFormulario}
                  required
                />
              </div>

              <div className="usuarios-form-field">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={manejarCambioFormulario}
                  required
                />
              </div>

              <div className="usuarios-form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambioFormulario}
                  required
                />
              </div>

              <div className="usuarios-form-field">
                <label>Empresa</label>
                <select
                  name="empresaId"
                  value={formulario.empresaId}
                  onChange={manejarCambioFormulario}
                  required
                >
                  <option value="">Seleccionar empresa</option>

                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="usuarios-form-field">
                <label>Rol</label>
                <select
                  name="rolId"
                  value={formulario.rolId}
                  onChange={manejarCambioFormulario}
                  required
                >
                  <option value="">Seleccionar rol</option>

                  {roles
                    .filter(
                      (rol) =>
                        esAdministrador || rol.nombre !== "Administrador"
                    )
                    .map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                </select>
              </div>

            </div>

            <div className="usuarios-form-actions">
              <button
                type="button"
                className="usuarios-btn-cancelar"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="usuarios-btn-guardar"
              >
                Crear empleado
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="usuarios-orden"
                  onClick={() => cambiarOrden("nombre")}
                >
                  Nombre
                  {orden.campo === "nombre" &&
                    (orden.direccion === "asc" ? " ↑" : " ↓")}
                </button>
              </th>

              <th onClick={() => cambiarOrden("email")}>
                Email
                {orden.campo === "email" &&
                  (orden.direccion === "asc" ? " ↑" : " ↓")}
              </th>

              <th onClick={() => cambiarOrden("empresa")}>
                Empresa
                {orden.campo === "empresa" &&
                  (orden.direccion === "asc" ? " ↑" : " ↓")}
              </th>

              <th onClick={() => cambiarOrden("rol")}>
                Rol
                {orden.campo === "rol" &&
                  (orden.direccion === "asc" ? " ↑" : " ↓")}
              </th>

              <th onClick={() => cambiarOrden("estado")}>
                Estado
                {orden.campo === "estado" &&
                  (orden.direccion === "asc" ? " ↑" : " ↓")}
              </th>

              <th>Acciones</th>
            </tr>

            <tr className="usuarios-filtros">
              <th>
                <input
                  type="text"
                  placeholder="Buscar nombre..."
                  value={filtros.nombre}
                  onChange={(e) =>
                    cambiarFiltro("nombre", e.target.value)
                  }
                />
              </th>

              <th>
                <input
                  type="text"
                  placeholder="Buscar email..."
                  value={filtros.email}
                  onChange={(e) =>
                    cambiarFiltro("email", e.target.value)
                  }
                />
              </th>

              <th>
                <select
                  value={filtros.empresa}
                  onChange={(e) =>
                    cambiarFiltro("empresa", e.target.value)
                  }
                >
                  <option value="">Todas</option>

                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.nombre}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </th>

              <th>
                <select
                  value={filtros.rol}
                  onChange={(e) =>
                    cambiarFiltro("rol", e.target.value)
                  }
                >
                  <option value="">Todos</option>

                  {roles
                    .filter((rol) => rol.nombre !== "Administrador")
                    .map((rol) => (
                      <option key={rol.id} value={rol.nombre}>
                        {rol.nombre}
                      </option>
                    ))}
                </select>
              </th>

              <th>
                <select
                  value={filtros.estado}
                  onChange={(e) =>
                    cambiarFiltro("estado", e.target.value)
                  }
                >
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((usuario) => {
              const estaEditando = editandoId === usuario.id;

              return (
                <tr key={usuario.id} className={!usuario.activo ? "usuario-inactivo" : ""}>

                  {/* NOMBRE */}
                  <td>
                    {estaEditando ? (
                      <div className="usuarios-nombre-edicion">
                        <input
                          type="text"
                          name="nombre"
                          value={edicion.nombre}
                          onChange={manejarCambioEdicion}
                          placeholder="Nombre"
                        />

                        <input
                          type="text"
                          name="apellido"
                          value={edicion.apellido}
                          onChange={manejarCambioEdicion}
                          placeholder="Apellido"
                        />
                      </div>
                    ) : (
                      `${usuario.nombre} ${usuario.apellido}`
                    )}
                  </td>

                  {/* EMAIL */}
                  <td>
                    {estaEditando ? (
                      <input
                        type="email"
                        name="email"
                        value={edicion.email}
                        onChange={manejarCambioEdicion}
                      />
                    ) : (
                      usuario.email
                    )}
                  </td>

                  {/* EMPRESA */}
                  <td>
                    {estaEditando ? (
                      <select
                        name="empresaId"
                        value={edicion.empresaId}
                        onChange={manejarCambioEdicion}
                      >
                        {empresas.map((empresa) => (
                          <option
                            key={empresa.id}
                            value={empresa.id}
                          >
                            {empresa.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      usuario.empresas?.nombre || "-"
                    )}
                  </td>

                  {/* ROL */}
                  <td>
                    {estaEditando ? (
                      <select
                        name="rolId"
                        value={edicion.rolId}
                        onChange={manejarCambioEdicion}
                      >
                        {roles
                          .filter(
                            (rol) =>
                              esAdministrador || rol.nombre !== "Administrador"
                          )
                          .map((rol) => (
                            <option key={rol.id} value={rol.id}>
                              {rol.nombre}
                            </option>
                          ))}
                      </select>
                    ) : (
                      usuario.roles?.nombre || "-"
                    )}
                  </td>

                  {/* ESTADO */}
                  <td>
                    {estaEditando ? (
                      <select
                        name="activo"
                        value={edicion.activo ? "true" : "false"}
                        onChange={manejarCambioEdicion}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    ) : (
                      usuario.activo ? "Activo" : "Inactivo"
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td>
                    {estaEditando ? (
                      <>
                        <button
                          className="usuarios-btn-guardar"
                          onClick={() => guardarEdicion(usuario.id)}
                        >
                          Guardar
                        </button>

                        <button
                          className="usuarios-btn-cancelar"
                          onClick={cancelarEdicion}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      usuario.auth_user_id === session?.user?.id ? (
                        <span className="usuarios-propio">—</span>
                      ) : (
                        <button
                          className="usuarios-btn-editar"
                          onClick={() => comenzarEdicion(usuario)}
                        >
                          Editar
                        </button>
                      )
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}