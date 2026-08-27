import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  obtenerPublicacionPorRotiseriaYFecha,
  eliminarImagenPublicacion,
} from "../../services/publicacion.service";

import { obtenerUsuarioPorAuthId } from "../../services/usuario.service";

export default function Publications() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([]);
  const [rotiserias, setRotiserias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [imagenesMarcadasEliminar, setImagenesMarcadasEliminar] = useState([]);
  const [imagenesNuevasEdicion, setImagenesNuevasEdicion] = useState([]);
  const [modalPublicacionExistente, setModalPublicacionExistente] = useState(false);
  const [mensajePublicacionExistente, setMensajePublicacionExistente] = useState("");
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [modalMensajeAbierto, setModalMensajeAbierto] = useState(false);
  const [modalMensajeTitulo, setModalMensajeTitulo] = useState("");
  const [modalMensajeTexto, setModalMensajeTexto] = useState("");
  const [formulario, setFormulario] = useState({
    rotiseriaId: "",
    menuTexto: "",
    aclaraciones: "",
  });

  const [edicion, setEdicion] = useState({
  rotiseriaId: "",
  menuTexto: "",
  aclaraciones: "",
  });

  function manejarEliminarImagen(imagen) {
    setImagenesMarcadasEliminar((actuales) => [
      ...actuales,
      imagen,
    ]);
  }

  function manejarSeleccionImagenesEdicion(event) {
    const archivos = Array.from(event.target.files);

    setImagenesNuevasEdicion((actuales) => [
      ...actuales,
      ...archivos,
    ]);

    event.target.value = "";
  }

  function mostrarMensaje(titulo, mensaje) {
    setModalMensajeTitulo(titulo);
    setModalMensajeTexto(mensaje);
    setModalMensajeAbierto(true);
  }

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
      mostrarMensaje(
        "Error al eliminar publicación",
        "No se pudo eliminar la publicación."
      );
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
      menuTexto: publicacion.menu_texto || "",
      aclaraciones: publicacion.aclaraciones || "",
    });

    setImagenesMarcadasEliminar([]);
    setImagenesNuevasEdicion([]);
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
      menuTexto: "",
      aclaraciones: "",
    });

    setImagenesMarcadasEliminar([]);
    setImagenesNuevasEdicion([]);
  }

  async function guardarEdicion(publicacionId) {
    try {
      const publicacionActualizada = await actualizarPublicacion(
        publicacionId,
        edicion
      );

      for (let i = 0; i < imagenesNuevasEdicion.length; i++) {
        const archivo = imagenesNuevasEdicion[i];

        const imagenSubida = await subirImagenPublicacion(
          archivo,
          publicacionId
        );

        await guardarImagenPublicacion(
          publicacionId,
          imagenSubida.url,
          i
        );
      }

      for (const imagen of imagenesMarcadasEliminar) {
        await eliminarImagenPublicacion(imagen);
      }

      const publicacionesActualizadas =
        await obtenerPublicaciones();

      setPublicaciones(publicacionesActualizadas);

      setEditandoId(null);

      setImagenesMarcadasEliminar([]);
      setImagenesNuevasEdicion([]);

      mostrarMensaje(
        "Publicación actualizada",
        "La publicación se actualizó correctamente."
      );
    } catch (error) {
      console.error("Error al actualizar publicación:", error);

      mostrarMensaje(
        "Error al actualizar publicación",
        "No se pudo actualizar la publicación."
      );
    }
  }

  async function manejarCrearPublicacion(event) {
    event.preventDefault();

    if (publicando) {
      return;
    }

    try {
      setPublicando(true);

      const usuario = await obtenerUsuarioPorAuthId(session.user.id);

      if (!usuario) {
        throw new Error(
          "No se encontró el usuario de la plataforma."
        );
      }

      const fechaHoy = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(new Date());

      const publicacionExistente =
        await obtenerPublicacionPorRotiseriaYFecha(
          formulario.rotiseriaId,
          fechaHoy
        );

      if (publicacionExistente) {
        setMensajePublicacionExistente(
          `Ya existe una publicación de ${
            publicacionExistente.rotiserias?.nombre ||
            "esta rotisería"
          } para el ${new Date(
            `${fechaHoy}T00:00:00`
          ).toLocaleDateString("es-AR")}.`
        );

        setModalPublicacionExistente(true);

        return;
      }

      const publicacionCreada = await crearPublicacion({
        rotiseriaId: formulario.rotiseriaId,
        fecha: fechaHoy,
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
        menuTexto: "",
        aclaraciones: "",
      });

      setImagenesSeleccionadas([]);

      setMostrarFormulario(false);

      setModalExitoAbierto(true);
    } catch (error) {
      console.error("Error al crear publicación:", error);

      mostrarMensaje(
        "Error al crear publicación",
        "No se pudo crear la publicación."
      );
    } finally {
      setPublicando(false);
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
              <label>Menú</label>

              <textarea
                name="menuTexto"
                value={formulario.menuTexto}
                onChange={manejarCambioFormulario}
                rows="8"
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

              <button
                type="submit"
                disabled={publicando}
              >
                {publicando ? "Publicando..." : "Publicar"}
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
            imagenesMarcadasEliminar={imagenesMarcadasEliminar}
            imagenesNuevasEdicion={imagenesNuevasEdicion}
            onEliminarImagen={manejarEliminarImagen}
            onSeleccionarImagenes={manejarSeleccionImagenesEdicion}
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
      <ConfirmModal
        abierto={modalPublicacionExistente}
        titulo="Publicación existente"
        mensaje={mensajePublicacionExistente}
        textoConfirmar="Entendido"
        textoCancelar=""
        onConfirm={() => setModalPublicacionExistente(false)}
        onCancel={() => setModalPublicacionExistente(false)}
      />
      <ConfirmModal
        abierto={modalExitoAbierto}
        titulo="Publicación creada"
        mensaje="La publicación se creó correctamente."
        textoConfirmar="Entendido"
        textoCancelar=""
        onConfirm={() => {
          setModalExitoAbierto(false);
          navigate("/publications");
        }}
        onCancel={() => {
          setModalExitoAbierto(false);
          navigate("/publications");
        }}
      />
      <ConfirmModal
        abierto={modalMensajeAbierto}
        titulo={modalMensajeTitulo}
        mensaje={modalMensajeTexto}
        textoConfirmar="Entendido"
        textoCancelar=""
        onConfirm={() => setModalMensajeAbierto(false)}
        onCancel={() => setModalMensajeAbierto(false)}
      />
    </div>
  );
}