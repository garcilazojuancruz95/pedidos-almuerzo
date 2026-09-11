import { useEffect, useState } from "react";
import "./DailyOrders.css";
import ExcelJS from "exceljs";
import { Search } from "lucide-react";

import {
  obtenerPedidosDelDia,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
} from "../../services/pedido.service";

import {
  obtenerUsuarios,
} from "../../services/usuario.service";

import {
  obtenerHomeOfficeDelDia,
  marcarHomeOffice,
  quitarHomeOffice,
} from "../../services/home-office.service";

import { obtenerPublicaciones } from "../../services/publicacion.service";

const PISO_POR_EMPRESA = {
  "Nasini": "1",
  "Nasini S.A.": "1",
  "AMEPE": "3",
  "Market Hub": "4",
};

function obtenerPiso(pedido) {
  const nombreEmpresa = pedido.usuarios?.empresas?.nombre;

  return PISO_POR_EMPRESA[nombreEmpresa] || "Sin piso";
}

export default function DailyOrders() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroRotiseria, setFiltroRotiseria] = useState("");
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  const [usuariosEnCasa, setUsuariosEnCasa] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [editandoPedidoId, setEditandoPedidoId] = useState(null);
  const [textoEdicionPedido, setTextoEdicionPedido] = useState("");
  const [mostrarFormularioPedido, setMostrarFormularioPedido] =
    useState(false);
  const [mostrarModalCarga, setMostrarModalCarga] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [erroresCarga, setErroresCarga] = useState({
    empleado: "",
    menu: "",
    pedido: "",
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");
  const [mostrarOpcionesEmpleado, setMostrarOpcionesEmpleado] =
    useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] =
    useState("");
  const [textoPedido, setTextoPedido] = useState("");
  const [pestanaPendientes, setPestanaPendientes] = useState("pendientes");
  const [pendientesExpandido, setPendientesExpandido] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  function solicitarCargaPedido() {
    const nuevosErrores = {
      empleado: "",
      menu: "",
      pedido: "",
    };

    if (!usuarioSeleccionado) {
      nuevosErrores.empleado = "Seleccioná un empleado.";
    }

    if (!publicacionSeleccionada) {
      nuevosErrores.menu = "Seleccioná un menú.";
    }

    if (!textoPedido.trim()) {
      nuevosErrores.pedido = "Escribí el pedido.";
    }

    setErroresCarga(nuevosErrores);

    if (
      nuevosErrores.empleado ||
      nuevosErrores.menu ||
      nuevosErrores.pedido
    ) {
      return;
    }

    setMostrarModalCarga(true);
  }

  function comenzarEdicionPedido(pedido) {
    setEditandoPedidoId(pedido.id);
    setTextoEdicionPedido(pedido.pedido);
  }

  async function confirmarCargaPedido() {
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
      setMostrarModalCarga(false);

      setUsuarioSeleccionado("");
      setBusquedaEmpleado("");
      setPublicacionSeleccionada("");
      setTextoPedido("");

    } catch (error) {
      console.error("Error al cargar pedido:", error);
      alert("No se pudo cargar el pedido.");
    }
  }

  async function guardarEdicionPedido() {
    const texto = textoEdicionPedido.trim();

    if (!texto) {
      alert("El pedido no puede estar vacío.");
      return;
    }

    try {
      await actualizarPedido(
        editandoPedidoId,
        texto
      );

      const pedidosActualizados = await obtenerPedidosDelDia();

      setPedidos(pedidosActualizados);

      setEditandoPedidoId(null);
      setTextoEdicionPedido("");
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      alert("No se pudo actualizar el pedido.");
    }
  }

  function solicitarEliminarPedido(pedido) {
    setPedidoAEliminar(pedido);
    setMostrarModalEliminar(true);
  }

  async function confirmarEliminarPedido() {
    if (!pedidoAEliminar) {
      return;
    }

    try {
      await eliminarPedido(pedidoAEliminar.id);

      const pedidosActualizados = await obtenerPedidosDelDia();

      setPedidos(pedidosActualizados);

      const empleadosActivos = usuarios.filter(
        (usuario) =>
          usuario.activo &&
          usuario.roles?.nombre === "Empleado"
      );

      const usuariosConPedido = new Set(
        pedidosActualizados.map(
          (pedido) => pedido.usuario_id
        )
      );

      const usuariosIdsEnCasa = new Set(
        usuariosEnCasa.map((empleado) => empleado.id)
      );

      const pendientes = empleadosActivos
        .filter(
          (empleado) =>
            !usuariosConPedido.has(empleado.id) &&
            !usuariosIdsEnCasa.has(empleado.id)
        )
        .sort((a, b) => {
          const nombreA = `${a.nombre || ""} ${a.apellido || ""}`;
          const nombreB = `${b.nombre || ""} ${b.apellido || ""}`;

          return nombreA.localeCompare(nombreB, "es", {
            sensitivity: "base",
          });
        });

      setUsuariosPendientes(pendientes);

      setMostrarModalEliminar(false);
      setPedidoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      alert("No se pudo eliminar el pedido.");
    }
  }

  async function alternarHomeOffice(usuarioId, estaEnCasa) {
    try {
      if (estaEnCasa) {
        await quitarHomeOffice(usuarioId);
      } else {
        await marcarHomeOffice(usuarioId);
      }

      await cargarDatos();
    } catch (error) {
      console.error("Error al cambiar estado de home office:", error);
      alert("No se pudo actualizar el estado del empleado.");
    }
  }

  async function cargarDatos() {
    try {
      setRefrescando(true);
      setError("");

      const [
        pedidosData,
        usuariosData,
        publicacionesData,
        homeOfficeData,
      ] = await Promise.all([
        obtenerPedidosDelDia(),
        obtenerUsuarios(),
        obtenerPublicaciones(),
        obtenerHomeOfficeDelDia(),
      ]);

      setPedidos(pedidosData);
      setUsuarios(usuariosData);
      setPublicaciones(publicacionesData);

      const empleadosEnCasa = homeOfficeData
        .map((registro) => registro.usuarios)
        .filter(
          (usuario) =>
            usuario &&
            usuario.activo &&
            usuario.roles?.nombre === "Empleado"
        )
        .sort((a, b) => {
          const nombreA = `${a.nombre || ""} ${a.apellido || ""}`;
          const nombreB = `${b.nombre || ""} ${b.apellido || ""}`;

          return nombreA.localeCompare(nombreB, "es", {
            sensitivity: "base",
          });
        });

      setUsuariosEnCasa(empleadosEnCasa);

      const empleadosActivos = usuariosData.filter(
        (usuario) =>
          usuario.activo &&
          usuario.roles?.nombre === "Empleado"
      );

      const usuariosConPedido = new Set(
        pedidosData.map((pedido) => pedido.usuario_id)
      );

      const usuariosIdsEnCasa = new Set(
        empleadosEnCasa.map((empleado) => empleado.id)
      );

      const pendientes = empleadosActivos
        .filter(
          (empleado) =>
            !usuariosConPedido.has(empleado.id) &&
            !usuariosIdsEnCasa.has(empleado.id)
        )
        .sort((a, b) => {
          const nombreA = `${a.nombre || ""} ${a.apellido || ""}`;
          const nombreB = `${b.nombre || ""} ${b.apellido || ""}`;

          return nombreA.localeCompare(nombreB, "es", {
            sensitivity: "base",
          });
        });

      setUsuariosPendientes(pendientes);
    } catch (error) {
      console.error(
        "Error al cargar pedidos y usuarios:",
        error
      );

      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
      setRefrescando(false);
    }
  }

  useEffect(() => {
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

  async function exportarExcel() {
    if (pedidosFiltrados.length === 0) {
      return;
    }

    const libro = new ExcelJS.Workbook();

    const hoja = libro.addWorksheet("Pedidos", {
      pageSetup: {
        orientation: "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          left: 0.25,
          right: 0.25,
          top: 0.3,
          bottom: 0.3,
          header: 0.1,
          footer: 0.1,
        },
      },
    });

    hoja.columns = [
      { header: "Piso", key: "piso", width: 8 },
      { header: "Nombre", key: "nombre", width: 28 },
      { header: "Pedido", key: "pedido", width: 55 },
      { header: "Rotisería", key: "rotiseria", width: 22 },
    ];

    pedidosFiltrados.forEach((pedido) => {
      hoja.addRow({
        piso: obtenerPiso(pedido),
        nombre: pedido.usuarios
          ? `${pedido.usuarios.nombre || ""} ${pedido.usuarios.apellido || ""}`.trim()
          : "Sin usuario",
        pedido: pedido.pedido || "",
        rotiseria: pedido.rotiserias?.nombre || "Sin rotisería",
      });
    });

    hoja.eachRow((fila, numeroFila) => {
      fila.height = 22;

      fila.eachCell((celda) => {
        celda.font = {
          name: "Arial",
          size: 12,
          bold: numeroFila === 1,
        };

        celda.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: numeroFila === 1 ? "FFD9D9D9" : "FFFFFFFF" },
        };

        celda.alignment = {
          vertical: "middle",
          horizontal: "left",
          wrapText: true,
        };

        celda.border = {
          top: { style: "thin", color: { argb: "FFB7B7B7" } },
          bottom: { style: "thin", color: { argb: "FFB7B7B7" } },
          left: { style: "thin", color: { argb: "FFB7B7B7" } },
          right: { style: "thin", color: { argb: "FFB7B7B7" } },
        };
      });
    });

    const buffer = await libro.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fecha = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `pedidos-${fecha}.xlsx`;

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(url);
  }
    
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
        <h1 className="page-title">Pedidos del día</h1>

        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setMostrarFormularioPedido(true)}
          >
            + Cargar pedido
          </button>

          <button
            className="btn-primary"
            onClick={exportarExcel}
          >
            Exportar Excel
          </button>

          <button className="btn-primary">
            Imprimir
          </button>
        </div>
      </div>

      {mostrarFormularioPedido && (
        <div className="order-form-card">
          <h2>Cargar pedido</h2>

          <div className="order-form-field">
            <label>Empleado</label>

            <div className="employee-search">
              <Search size={16} className="employee-search-icon" />

              <input
                type="text"
                placeholder="Buscar empleado..."
                value={busquedaEmpleado}
                onChange={(event) => {
                  setBusquedaEmpleado(event.target.value);
                  setUsuarioSeleccionado("");
                  setMostrarOpcionesEmpleado(true);
                }}
                onFocus={() => setMostrarOpcionesEmpleado(true)}
                onBlur={() => setMostrarOpcionesEmpleado(false)}
              />

              {mostrarOpcionesEmpleado && (
                <ul className="employee-search-options">
                  {usuarios
                    .filter((usuario) => usuario.activo)
                    .filter((usuario) =>
                      `${usuario.nombre} ${usuario.apellido}`
                        .toLowerCase()
                        .includes(busquedaEmpleado.toLowerCase())
                    )
                    .sort((a, b) => {
                      const nombreA = `${a.nombre || ""} ${a.apellido || ""}`;
                      const nombreB = `${b.nombre || ""} ${b.apellido || ""}`;

                      return nombreA.localeCompare(nombreB, "es", {
                        sensitivity: "base",
                      });
                    })
                    .map((usuario) => (
                      <li
                        key={usuario.id}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setUsuarioSeleccionado(usuario.id);
                          setBusquedaEmpleado(
                            `${usuario.nombre} ${usuario.apellido}`
                          );
                          setMostrarOpcionesEmpleado(false);
                        }}
                      >
                        {usuario.nombre} {usuario.apellido}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            {erroresCarga.empleado && (
              <p className="form-error">
                {erroresCarga.empleado}
              </p>
            )}
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
            {erroresCarga.menu && (
              <p className="form-error">
                {erroresCarga.menu}
              </p>
            )}
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

            {erroresCarga.pedido && (
              <p className="form-error">
                {erroresCarga.pedido}
              </p>
            )}
          </div>

          <div className="order-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setMostrarFormularioPedido(false);
                setUsuarioSeleccionado("");
                setBusquedaEmpleado("");
                setPublicacionSeleccionada("");
                setTextoPedido("");
                setErroresCarga({
                  empleado: "",
                  menu: "",
                  pedido: "",
                });
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={solicitarCargaPedido}
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

      <div className="pending-card">

        <div className="pending-tabs">
          <button
            type="button"
            className={
              pestanaPendientes === "pendientes"
                ? "pending-tab active"
                : "pending-tab"
            }
            onClick={() => setPestanaPendientes("pendientes")}
          >
            Pendientes ({usuariosPendientes.length})
          </button>

          <button
            type="button"
            className={
              pestanaPendientes === "enCasa"
                ? "pending-tab active"
                : "pending-tab"
            }
            onClick={() => setPestanaPendientes("enCasa")}
          >
            En casa ({usuariosEnCasa.length})
          </button>
        </div>

        {pestanaPendientes === "pendientes" && (
          <div>
            <div className="pending-header">
              <button
                type="button"
                className="pending-toggle"
                onClick={() =>
                  setPendientesExpandido(!pendientesExpandido)
                }
              >
                <span>Usuarios pendientes</span>

                <span className="pending-toggle-icon">
                  {pendientesExpandido ? "▲" : "▼"}
                </span>
              </button>

              <button
                type="button"
                className="refresh-button"
                onClick={cargarDatos}
                disabled={refrescando}
                title="Refrescar"
                aria-label="Refrescar datos"
              >
                {refrescando ? "↻" : "↻"}
              </button>
            </div>

            {pendientesExpandido && (
              <>
                {usuariosPendientes.length === 0 ? (
                  <p>No hay usuarios pendientes.</p>
                ) : (
                  <ul className="pending-list">
                    {usuariosPendientes.map((usuario) => (
                      <li key={usuario.id} className="pending-list-item">
                        <span>
                          {usuario.nombre} {usuario.apellido}
                        </span>

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() =>
                            alternarHomeOffice(usuario.id, false)
                          }
                        >
                          Marcar en casa
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

        {pestanaPendientes === "enCasa" && (
          <div>
            <h2>Usuarios en casa</h2>

            {usuariosEnCasa.length === 0 ? (
              <p>No hay usuarios marcados como Home Office.</p>
            ) : (
              <ul className="pending-list">
                {usuariosEnCasa.map((usuario) => (
                  <li key={usuario.id} className="pending-list-item">
                    <span>
                      {usuario.nombre} {usuario.apellido}
                    </span>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        alternarHomeOffice(usuario.id, true)
                      }
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>

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
                  <th>Piso</th>
                  <th>Nombre</th>
                  <th>Pedido</th>
                  <th>Rotisería</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rotiseria.pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      {obtenerPiso(pedido)}
                    </td>

                    <td>
                      {pedido.usuarios
                        ? `${pedido.usuarios.nombre} ${pedido.usuarios.apellido}`
                        : "Sin usuario"}
                    </td>

                    <td>
                      {editandoPedidoId === pedido.id ? (
                        <textarea
                          value={textoEdicionPedido}
                          onChange={(event) =>
                            setTextoEdicionPedido(event.target.value)
                          }
                          rows="3"
                        />
                      ) : (
                        pedido.pedido
                      )}
                    </td>

                    <td>
                      {pedido.rotiserias?.nombre || "Sin rotisería"}
                    </td>
                    <td>
                      <div className="order-actions">
                        {editandoPedidoId === pedido.id ? (
                          <>

                            <button
                                type="button"
                                className="btn-edit"
                                onClick={guardarEdicionPedido}
                              >
                                Guardar
                              </button>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => {
                                setEditandoPedidoId(null);
                                setTextoEdicionPedido("");
                              }}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-edit"
                              onClick={() => comenzarEdicionPedido(pedido)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => solicitarEliminarPedido(pedido)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {mostrarModalEliminar && pedidoAEliminar && (
        <div className="modal-overlay">
          <div className="modal-confirmacion">
            <h2>Eliminar pedido</h2>

            <p>
              ¿Estás seguro de que querés eliminar el pedido de{" "}
              <strong>
                {pedidoAEliminar.usuarios?.nombre}{" "}
                {pedidoAEliminar.usuarios?.apellido}
              </strong>
              ?
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setMostrarModalEliminar(false);
                  setPedidoAEliminar(null);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-delete"
                onClick={confirmarEliminarPedido}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalCarga && (
        <div className="modal-overlay">
          <div className="modal-confirmacion">
            <h2>Cargar pedido</h2>

            <p>
              Vas a cargar el siguiente pedido:
            </p>

            <div className="modal-resumen">
              <p>
                <strong>Empleado:</strong>{" "}
                {usuarios.find(
                  (usuario) => usuario.id === usuarioSeleccionado
                )?.nombre}{" "}
                {usuarios.find(
                  (usuario) => usuario.id === usuarioSeleccionado
                )?.apellido}
              </p>

              <p>
                <strong>Rotisería:</strong>{" "}
                {publicaciones.find(
                  (publicacion) =>
                    publicacion.id === publicacionSeleccionada
                )?.rotiserias?.nombre || "Sin rotisería"}
              </p>

              <p>
                <strong>Pedido:</strong>{" "}
                {textoPedido}
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMostrarModalCarga(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={confirmarCargaPedido}
              >
                Cargar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}