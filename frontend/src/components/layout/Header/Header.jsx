import "./Header.css";

import { signOut } from "../../../services/auth.service";
import { useAuth } from "../../../contexts/AuthContext";

export default function Header() {
  const { usuario } = useAuth();

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
      <div>
        <h2>🍽 Plataforma de Pedidos de Almuerzo</h2>
      </div>

      <div className="header-user">
        <span>{rol}</span>

        <button onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}