import "./Sidebar.css";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        🍽
        <div>
          <h2>Pedidos</h2>
          <span>Operador</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end>
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

        <NavLink to="/profile">
          <User size={20} />
          Perfil
        </NavLink>
      </nav>
    </div>
  );
}