export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <p
        style={{
          marginTop: "8px",
          color: "#666",
        }}
      >
        Bienvenido, Operador.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Publicaciones</h3>
          <h1>3</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Pedidos</h3>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "220px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3>Pendientes</h3>
          <h1>6</h1>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2>Usuarios pendientes</h2>

        <ul
          style={{
            marginTop: "20px",
            lineHeight: "2",
          }}
        >
          <li>Juan Pérez</li>
          <li>María Gómez</li>
          <li>Pedro López</li>
        </ul>
      </div>
    </>
  );
}