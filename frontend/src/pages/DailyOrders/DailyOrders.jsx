import { useEffect, useState } from "react";
import "./DailyOrders.css";
import * as XLSX from "xlsx-js-style";

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
} from "../../services/home-office.service";

import { obtenerPublicaciones } from "../../services/publicacion.service";

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
  const [publicacionSeleccionada, setPublicacionSeleccionada] =
    useState("");
  const [textoPedido, setTextoPedido] = useState("");
  const [pestanaPendientes, setPestanaPendientes] = useState("pendientes");
  const [pendientesExpandido, setPendientesExpandido] = useState(false);

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

  useEffect(() => {
    async function cargarDatos() {
      try {
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

  function exportarExcel() {
    if (pedidosFiltrados.length === 0) {
      return;
    }

    const datos = pedidosFiltrados.map((pedido) => ({
      Empresa:
        pedido.usuarios?.empresas?.nombre || "Sin empresa",

      Usuario: pedido.usuarios
        ? `${pedido.usuarios.nombre || ""} ${pedido.usuarios.apellido || ""}`.trim()
        : "Sin usuario",

      Rotisería:
        pedido.rotiserias?.nombre || "Sin rotisería",

      Pedido:
        pedido.pedido || "",

      Observaciones:
        pedido.observaciones || "",
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    hoja["!cols"] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 25 },
      { wch: 50 },
      { wch: 40 },
    ];

    const rango = XLSX.utils.decode_range(hoja["!ref"]);

    for (let fila = rango.s.r; fila <= rango.e.r; fila++) {
      for (let columna = rango.s.c; columna <= rango.e.c; columna++) {
        const celda = hoja[XLSX.utils.encode_cell({
          r: fila,
          c: columna,
        })];

        if (!celda) {
          continue;
        }

        celda.s = {
          font: {
            bold: fila === 0,
          },

          fill: {
            fgColor: {
              rgb: fila === 0 ? "D9D9D9" : "FFFFFF",
            },
          },

          alignment: {
            vertical: "center",
            horizontal: "left",
            wrapText: true,
          },

          border: {
            top: {
              style: "thin",
              color: { rgb: "B7B7B7" },
            },
            bottom: {
              style: "thin",
              color: { rgb: "B7B7B7" },
            },
            left: {
              style: "thin",
              color: { rgb: "B7B7B7" },
            },
            right: {
              style: "thin",
              color: { rgb: "B7B7B7" },
            },
          },
        };
      }
    }

    hoja["!rows"] = [
      { hpt: 22 },
    ];

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Pedidos"
    );

    const fecha = new Date().toISOString().slice(0, 10);

    XLSX.writeFile(
      libro,
      `pedidos-${fecha}.xlsx`
    );
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
        <h1>Pedidos del día</h1>

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

            <select
              value={usuarioSeleccionado}
              onChange={(event) =>
                setUsuarioSeleccionado(event.target.value)
              }
            >
              <option value="">Seleccionar empleado</option>

              {usuarios
                .filter(
                  (usuario) =>
                    usuario.activo &&
                    usuario.roles?.nombre === "Empleado"
                )
                .sort((a, b) => {
                  const nombreA = `${a.nombre || ""} ${a.apellido || ""}`;
                  const nombreB = `${b.nombre || ""} ${b.apellido || ""}`;

                  return nombreA.localeCompare(nombreB, "es", {
                    sensitivity: "base",
                  });
                })
                .map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
            </select>
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

            {pendientesExpandido && (
              <>
                {usuariosPendientes.length === 0 ? (
                  <p>No hay usuarios pendientes.</p>
                ) : (
                  <ul className="pending-list">
                    {usuariosPendientes.map((usuario) => (
                      <li key={usuario.id}>
                        {usuario.nombre} {usuario.apellido}
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
                  <li key={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
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
                  <th>Empresa</th>
                  <th>Usuario</th>
                  <th>Rotisería</th>
                  <th>Pedido</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {rotiseria.pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      {pedido.usuarios?.empresas?.nombre ||
                        "Sin empresa"}
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