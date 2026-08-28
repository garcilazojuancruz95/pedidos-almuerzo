import "./Sidebar.css";

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  User,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Sidebar() {
  const { usuario } = useAuth();

  const rol = usuario?.roles?.nombre;

  const esEmpleado = rol === "Empleado";
  const esOperador = rol === "Operador" || rol === "Administrador";

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        🍽

        <div>
          <h2>Pedidos</h2>
          <span>{rol}</span>
        </div>
      </div>

      <nav className="sidebar-menu">

        {esOperador && (
          <>
            <NavLink to="/dashboard">
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink to="/publications">
              <ClipboardList size={20} />
              Publicaciones
            </NavLink>

            <NavLink to="/daily-orders">
              <FileText size={20} />
              Pedidos del día
            </NavLink>

            <NavLink to="/users">
              <Users size={20} />
              Usuarios
            </NavLink>
          </>
        )}

        {esEmpleado && (
          <NavLink to="/my-order">
            <ClipboardList size={20} />
            Mi pedido
          </NavLink>
        )}

        <NavLink to="/profile">
          <User size={20} />
          Perfil
        </NavLink>

      </nav>
    </div>
  );
}