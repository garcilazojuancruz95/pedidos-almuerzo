import { useEffect, useState } from "react";
import "./Publicaciones.css";

import { useAuth } from "../../contexts/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import PublicationCard from "../../components/publications/PublicationCard/PublicationCard";

import {
  obtenerPublicaciones,
  obtenerRotiserias,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
  subirImagenPublicacion,
  guardarImagenPublicacion,
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
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);

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

  function manejarSeleccionImagenes(event) {
    const archivos = Array.from(event.target.files);

    setImagenesSeleccionadas(archivos);
  }

  function solicitarEliminarPublicacion(publicacionId) {
    setPublicacionAEliminar(publicacionId);
    setModalEliminarAbierto(true);
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
        throw new Error(
          "No se encontró el usuario de la plataforma."
        );
      }

      const publicacionCreada = await crearPublicacion({
        rotiseriaId: formulario.rotiseriaId,
        fecha: formulario.fecha,
        menuTexto: formulario.menuTexto,
        aclaraciones: formulario.aclaraciones,
        publicadoPor: usuario.id,
      });

      for (let i = 0; i < imagenesSeleccionadas.length; i++) {
        const archivo = imagenesSeleccionadas[i];

        const imagenSubida = await subirImagenPublicacion(
          archivo,
          publicacionCreada.id
        );

        await guardarImagenPublicacion(
          publicacionCreada.id,
          imagenSubida.url,
          i
        );
      }

      const publicacionesActualizadas =
        await obtenerPublicaciones();

      setPublicaciones(publicacionesActualizadas);

      setFormulario({
        rotiseriaId: "",
        fecha: new Date().toISOString().split("T")[0],
        menuTexto: "",
        aclaraciones: "",
      });

      setImagenesSeleccionadas([]);

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

            <div className="publication-form-field">
              <label>Imágenes</label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={manejarSeleccionImagenes}
              />

              {imagenesSeleccionadas.length > 0 && (
                <p>
                  {imagenesSeleccionadas.length} imagen
                  {imagenesSeleccionadas.length !== 1 ? "es" : ""} seleccionada
                  {imagenesSeleccionadas.length !== 1 ? "s" : ""}
                </p>
              )}
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
        publicaciones.map((publicacion) => (
          <PublicationCard
            key={publicacion.id}
            publicacion={publicacion}
            rotiserias={rotiserias}
            estaEditando={editandoId === publicacion.id}
            edicion={edicion}
            onEditar={comenzarEdicion}
            onCambioEdicion={manejarCambioEdicion}
            onGuardar={guardarEdicion}
            onCancelar={cancelarEdicion}
            onEliminar={solicitarEliminarPublicacion}
          />
        ))
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