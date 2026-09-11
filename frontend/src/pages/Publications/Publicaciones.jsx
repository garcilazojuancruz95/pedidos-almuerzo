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
  const [previsualizacionesFormulario, setPrevisualizacionesFormulario] =
    useState([]);
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

  function manejarSeleccionImagenesEdicion(archivos) {
    setImagenesNuevasEdicion((actuales) => [
      ...actuales,
      ...archivos,
    ]);
  }

  function quitarImagenSeleccionada(index) {
    setImagenesSeleccionadas((actuales) =>
      actuales.filter((_, i) => i !== index)
    );
  }

  function quitarImagenNuevaEdicion(index) {
    setImagenesNuevasEdicion((actuales) =>
      actuales.filter((_, i) => i !== index)
    );
  }

  function obtenerImagenDelPortapapeles(event) {
    const item = Array.from(event.clipboardData?.items || []).find(
      (item) => item.type.startsWith("image/")
    );

    return item ? item.getAsFile() : null;
  }

  function manejarPegadoImagenFormulario(event) {
    const archivo = obtenerImagenDelPortapapeles(event);

    if (!archivo) {
      return;
    }

    event.preventDefault();

    setImagenesSeleccionadas((actuales) => [...actuales, archivo]);
  }

  function manejarPegadoImagenEdicion(event) {
    const archivo = obtenerImagenDelPortapapeles(event);

    if (!archivo) {
      return;
    }

    event.preventDefault();

    manejarSeleccionImagenesEdicion([archivo]);
  }

  function compartirPorWhatsApp() {
    const mensaje =
      "Ya están cargadas las publicaciones del día en la plataforma: https://pedidos.nasini.com.ar";

    window.open(
      `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
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
    const urls = imagenesSeleccionadas.map((archivo) =>
      URL.createObjectURL(archivo)
    );

    setPrevisualizacionesFormulario(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagenesSeleccionadas]);

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
        <h1 className="page-title">Publicaciones del día</h1>

        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setMostrarFormulario(true)}
          >
            + Nueva publicación
          </button>

          <button
            className="btn-whatsapp"
            onClick={compartirPorWhatsApp}
            title="Avisar por WhatsApp"
            aria-label="Avisar por WhatsApp"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 22.09h-.02a9.95 9.95 0 0 1-5.075-1.389l-.364-.216-3.775.99 1.008-3.68-.237-.377A9.95 9.95 0 0 1 2.058 12c0-5.52 4.492-10.01 10.02-10.01 2.676 0 5.19 1.043 7.083 2.938a9.947 9.947 0 0 1 2.93 7.089c-.003 5.52-4.494 10.073-10.041 10.073zm8.53-18.58A11.93 11.93 0 0 0 12.078 0C5.507 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L.057 24l6.304-1.652a11.93 11.93 0 0 0 5.706 1.454h.005c6.57 0 11.918-5.335 11.921-11.893a11.83 11.83 0 0 0-3.413-8.399z" />
            </svg>
            Avisar por WhatsApp
          </button>
        </div>
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
                onPaste={manejarPegadoImagenFormulario}
                rows="8"
                placeholder="Escribí el menú o pegá una imagen (Ctrl+V)"
              />

              {previsualizacionesFormulario.length > 0 && (
                <div className="publication-menu-previews">
                  {previsualizacionesFormulario.map((url, index) => (
                    <div
                      key={index}
                      className="publication-menu-preview-item"
                    >
                      <img
                        src={url}
                        alt="Imagen pegada"
                        className="publication-menu-preview"
                      />

                      <button
                        type="button"
                        className="publication-menu-preview-quitar"
                        onClick={() => quitarImagenSeleccionada(index)}
                        aria-label="Quitar imagen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
        <div className="publications-grid">
          {publicaciones.map((publicacion) => (
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
              onPegarImagenMenu={manejarPegadoImagenEdicion}
              onQuitarImagenNueva={quitarImagenNuevaEdicion}
            />
          ))}
        </div>
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