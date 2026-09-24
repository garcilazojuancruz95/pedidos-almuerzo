import { useState } from "react";
import "./Sidebar.css";

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  User,
  Users,
  Menu,
  ChevronsLeft,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Sidebar() {
  const { usuario } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const rol = usuario?.roles?.nombre;

  const esEmpleado = rol === "Empleado";
  const esOperador = rol === "Operador" || rol === "Administrador";

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <div className="sidebar">

      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setMenuAbierto((abierto) => !abierto)}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
      >
        <span className="sidebar-toggle-icon">
          <Menu
            size={22}
            className={
              "sidebar-toggle-icon-menu" +
              (menuAbierto ? " sidebar-toggle-icon-oculto" : "")
            }
          />
          <ChevronsLeft
            size={22}
            className={
              "sidebar-toggle-icon-cerrar" +
              (menuAbierto ? "" : " sidebar-toggle-icon-oculto")
            }
          />
        </span>
      </button>

      <nav
        className={
          "sidebar-menu" + (menuAbierto ? " sidebar-menu-abierto" : "")
        }
      >

        {esOperador && (
          <>
            <NavLink to="/dashboard" onClick={cerrarMenu}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink to="/publications" onClick={cerrarMenu}>
              <ClipboardList size={20} />
              Publicaciones
            </NavLink>

            <NavLink to="/daily-orders" onClick={cerrarMenu}>
              <FileText size={20} />
              Pedidos del día
            </NavLink>

            <NavLink to="/users" onClick={cerrarMenu}>
              <Users size={20} />
              Usuarios
            </NavLink>
          </>
        )}

        {esEmpleado && (
          <NavLink to="/my-order" onClick={cerrarMenu}>
            <ClipboardList size={20} />
            Menú
          </NavLink>
        )}

      </nav>
    </div>
  );
}