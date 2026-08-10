import "./Header.css";

import { signOut } from "../../../services/auth.service";

export default function Header() {
  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <header className="header">
      <div>
        <h2>🍽 Plataforma de Pedidos de Almuerzo</h2>
      </div>

      <div className="header-user">
        <span>Operador</span>
        <button onClick={handleLogout}>Salir</button>
      </div>
    </header>
  );
}