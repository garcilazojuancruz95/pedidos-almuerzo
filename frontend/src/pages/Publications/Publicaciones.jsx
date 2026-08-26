import { useEffect, useState } from "react";
import "./Publicaciones.css";

import { useAuth } from "../../contexts/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";

import {
  obtenerPublicaciones,
  obtenerRotiserias,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
} from "../../services/publicacion.service";

import { obtenerUsuarioPorAuthId } from "../../services/usuario.service";

export default function Publications() {
  const { session } = useAuth();

  const [publicaciones, setPublicaciones] = useState([]);
  const [rotiserias, setRotiserias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null);

  const [formulario, setFormulario] = useState({
    rotiseriaId: "",
    fecha: new Date().toISOString().split("T")[0],
    menuTexto: "",
    aclaraciones: "",
  });

  const [edicion, setEdicion] = useState({
  rotiseriaId: "",
  fecha: "",
  menuTexto: "",
  aclaraciones: "",
  
  });

  async function confirmarEliminarPublicacion() {
    try {
      await eliminarPublicacion(publicacionAEliminar);

      setPublicaciones((actuales) =>
        actuales.filter(
          (publicacion) => publicacion.id !== publicacionAEliminar
        )
      );

      setModalEliminarAbierto(false);
      setPublicacionAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      alert("No se pudo eliminar la publicación.");
    }
  }

  async function confirmarEliminarPublicacion() {
    try {
      await eliminarPublicacion(publicacionAEliminar);

      setPublicaciones((actuales) =>
        actuales.filter(
          (publicacion) => publicacion.id !== publicacionAEliminar
        )
      );

      setModalEliminarAbierto(false);
      setPublicacionAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      alert("No se pudo eliminar la publicación.");
    }
  }

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [publicacionesData, rotiseriasData] = await Promise.all([
          obtenerPublicaciones(),
          obtenerRotiserias(),
        ]);

        setPublicaciones(publicacionesData);
        setRotiserias(rotiseriasData);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
        setError("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  function comenzarEdicion(publicacion) {
    setEditandoId(publicacion.id);

    setEdicion({
      rotiseriaId: publicacion.rotiseria_id || "",
      fecha: publicacion.fecha || "",
      menuTexto: publicacion.menu_texto || "",
      aclaraciones: publicacion.aclaraciones || "",
    });
  }

  function manejarCambioEdicion(event) {
    const { name, value } = event.target;

    setEdicion((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  function manejarCambioFormulario(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

function cancelarEdicion() {
  setEditandoId(null);

  setEdicion({
    rotiseriaId: "",
    fecha: "",
    menuTexto: "",
    aclaraciones: "",
  });
}

  async function guardarEdicion(publicacionId) {
    try {
      const publicacionActualizada = await actualizarPublicacion(
        publicacionId,
        edicion
      );

      setPublicaciones((actuales) =>
        actuales.map((publicacion) =>
          publicacion.id === publicacionId
            ? publicacionActualizada
            : publicacion
        )
      );

      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar publicación:", error);
      alert("No se pudo actualizar la publicación.");
    }
  }

  async function manejarCrearPublicacion(event) {
    event.preventDefault();

    try {
      const usuario = await obtenerUsuarioPorAuthId(session.user.id);

      if (!usuario) {
        throw new Error("No se encontró el usuario de la plataforma.");
      }

      await crearPublicacion({
        rotiseriaId: formulario.rotiseriaId,
        fecha: formulario.fecha,
        menuTexto: formulario.menuTexto,
        aclaraciones: formulario.aclaraciones,
        publicadoPor: usuario.id,
      });

      const publicacionesActualizadas = await obtenerPublicaciones();

      setPublicaciones(publicacionesActualizadas);

      setFormulario({
        rotiseriaId: "",
        fecha: new Date().toISOString().split("T")[0],
        menuTexto: "",
        aclaraciones: "",
      });

      setMostrarFormulario(false);

      alert("Publicación creada correctamente.");
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("No se pudo crear la publicación.");
    }
  }

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

        <button
          className="btn-primary"
          onClick={() => setMostrarFormulario(true)}
        >
          + Nueva publicación
        </button>
      </div>

      {mostrarFormulario && (
        <div className="publication-form">
          <h2>Nueva publicación</h2>

          <form onSubmit={manejarCrearPublicacion}>
            <div className="publication-form-field">
              <label>Rotisería</label>

              <select
                name="rotiseriaId"
                value={formulario.rotiseriaId}
                onChange={manejarCambioFormulario}
                required
              >
                <option value="">Seleccionar rotisería</option>

                {rotiserias.map((rotiseria) => (
                  <option key={rotiseria.id} value={rotiseria.id}>
                    {rotiseria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="publication-form-field">
              <label>Fecha</label>

              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={manejarCambioFormulario}
                required
              />
            </div>

            <div className="publication-form-field">
              <label>Menú</label>

              <textarea
                name="menuTexto"
                value={formulario.menuTexto}
                onChange={manejarCambioFormulario}
                rows="8"
                required
              />
            </div>

            <div className="publication-form-field">
              <label>Aclaraciones</label>

              <textarea
                name="aclaraciones"
                value={formulario.aclaraciones}
                onChange={manejarCambioFormulario}
                rows="4"
              />
            </div>

            <div className="publication-form-actions">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>

              <button type="submit">
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {publicaciones.length === 0 ? (
        <p>No hay publicaciones cargadas.</p>
      ) : (
        publicaciones.map((publicacion) => {
          const estaEditando = editandoId === publicacion.id;

          return (
            <div
              className="publication-card"
              key={publicacion.id}
            >
              <div className="publication-top">
                {estaEditando ? (
                  <select
                    name="rotiseriaId"
                    value={edicion.rotiseriaId}
                    onChange={manejarCambioEdicion}
                  >
                    {rotiserias.map((rotiseria) => (
                      <option
                        key={rotiseria.id}
                        value={rotiseria.id}
                      >
                        {rotiseria.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <h2>
                    🍽{" "}
                    {publicacion.rotiserias?.nombre || "Sin rotisería"}
                  </h2>
                )}

                <div className="actions">
                  {estaEditando ? (
                    <>
                      <button
                        onClick={() => guardarEdicion(publicacion.id)}
                      >
                        Guardar
                      </button>

                      <button onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => comenzarEdicion(publicacion)}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => solicitarEliminarPublicacion(publicacion.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {publicacion.publicacion_imagenes?.length > 0 && (
                <div className="publication-images">
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

              <div className="publication-content">
                {estaEditando ? (
                  <div className="publication-form-field">
                    <label>Fecha</label>

                    <input
                      type="date"
                      name="fecha"
                      value={edicion.fecha}
                      onChange={manejarCambioEdicion}
                    />
                  </div>
                ) : (
                  <div className="publication-fecha">
                    {new Date(
                      `${publicacion.fecha}T00:00:00`
                    ).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                )}

                {estaEditando ? (
                  <div className="publication-form-field">
                    <label>Menú</label>

                    <textarea
                      name="menuTexto"
                      value={edicion.menuTexto}
                      onChange={manejarCambioEdicion}
                      rows="10"
                    />
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
                      onChange={manejarCambioEdicion}
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
        })
      )}
      <ConfirmModal
        abierto={modalEliminarAbierto}
        titulo="Eliminar publicación"
        mensaje="¿Estás seguro de que querés eliminar esta publicación?"
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirm={confirmarEliminarPublicacion}
        onCancel={() => {
          setModalEliminarAbierto(false);
          setPublicacionAEliminar(null);
        }}
      />
    </div>
  );
}