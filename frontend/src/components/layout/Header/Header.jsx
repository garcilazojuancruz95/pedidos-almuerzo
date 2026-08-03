import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div>
        <h2>🍽 Plataforma de Pedidos de Almuerzo</h2>
      </div>

      <div className="header-user">
        <span>Operador</span>
        <button>Salir</button>
      </div>
    </header>
  );
}