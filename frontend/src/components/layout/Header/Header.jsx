import { useEffect, useState } from "react";
import "./Header.css";

import { signOut } from "../../../services/auth.service";
import { useAuth } from "../../../contexts/AuthContext";
import { obtenerMisPedidosDelDia } from "../../../services/pedido.service";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";

import {
  estaEnHomeOffice,
  marcarHomeOffice,
  quitarHomeOffice,
} from "../../../services/home-office.service";

export default function Header() {
  const { usuario } = useAuth();

  const [enHomeOffice, setEnHomeOffice] = useState(false);
  const [cargandoHomeOffice, setCargandoHomeOffice] = useState(true);
  const [mostrarAvisoHomeOffice, setMostrarAvisoHomeOffice] = useState(false);

  async function cargarEstadoHomeOffice() {
    if (!usuario?.id) {
      setCargandoHomeOffice(false);
      return;
    }

    try {
      const estado = await estaEnHomeOffice(usuario.id);
      setEnHomeOffice(estado);
    } catch (error) {
      console.error(
        "Error al consultar Home Office:",
        error
      );
    } finally {
      setCargandoHomeOffice(false);
    }
  }

  useEffect(() => {
    cargarEstadoHomeOffice();
  }, [usuario]);

  useEffect(() => {
    if (!usuario?.id) {
      return;
    }

    let fechaAnterior = new Date().toLocaleDateString();

    const intervalo = setInterval(() => {
      const fechaActual = new Date().toLocaleDateString();

      if (fechaActual !== fechaAnterior) {
        fechaAnterior = fechaActual;
        cargarEstadoHomeOffice();
      }
    }, 30000);

    return () => clearInterval(intervalo);
  }, [usuario]);

  async function manejarHomeOffice() {
    if (!usuario?.id) {
      return;
    }

    try {
      if (enHomeOffice) {
        await quitarHomeOffice(usuario.id);
        setEnHomeOffice(false);

        window.dispatchEvent(
          new CustomEvent("homeOfficeChanged", {
            detail: false,
          })
        );
      } else {
        const pedidosDelDia = await obtenerMisPedidosDelDia(usuario.id);

        if (pedidosDelDia.length > 0) {
          setMostrarAvisoHomeOffice(true);
          return;
        }

        await marcarHomeOffice(usuario.id);
        setEnHomeOffice(true);

        window.dispatchEvent(
          new CustomEvent("homeOfficeChanged", {
            detail: true,
          })
        );
      }
    } catch (error) {
      console.error(
        "Error al actualizar Home Office:",
        error
      );
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  const rol = usuario?.roles?.nombre || "";

  return (
    <header className="header">
      <div className="header-brand">
        <img
          src="/images/logo-nasini.svg"
          alt="Nasini"
          className="header-logo header-logo-full"
        />

        <img
          src="/images/logo.svg"
          alt="Nasini"
          className="header-logo header-logo-icon"
        />

        <h2>Plataforma de Pedidos de Almuerzo</h2>
      </div>

      <div className="header-user">

        {rol === "Empleado" && !cargandoHomeOffice && (
          <button
            type="button"
            className={`home-office-switch ${
              enHomeOffice ? "activo" : ""
            }`}
            onClick={manejarHomeOffice}
            aria-label={
              enHomeOffice
                ? "Cambiar a estoy en la oficina"
                : "Cambiar a estoy en casa"
            }
          >
            <span className="home-office-track">
              <span className="home-office-knob">
                {enHomeOffice ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 10.5 12 3l9 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 9.5V21h14V9.5M9 21v-6h6v6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 21V4h11v17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 8h5v13h-5M7 8h3M7 12h3M7 16h3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              <span className="home-office-label">
                {enHomeOffice
                  ? "Estoy en casa"
                  : "Estoy en la oficina"}
              </span>
            </span>
          </button>
        )}

        <span className="header-user-name">
          {usuario
            ? `${usuario.nombre} ${usuario.apellido}`
            : ""}
        </span>

        <button onClick={handleLogout}>
          Salir
        </button>
      </div>
      <ConfirmModal
        abierto={mostrarAvisoHomeOffice}
        titulo="No podés activar Home Office"
        mensaje="Eliminá primero tus pedidos para poder activar Home Office."
        textoConfirmar="Entendido"
        textoCancelar=""
        onConfirm={() => setMostrarAvisoHomeOffice(false)}
        onCancel={() => setMostrarAvisoHomeOffice(false)}
      />
    </header>
  );
}