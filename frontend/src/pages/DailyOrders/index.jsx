import "./DailyOrders.css";

export default function DailyOrders() {
  return (
    <div className="daily-orders">

      <div className="page-header">
        <h1>Pedidos del día</h1>

        <div className="header-actions">
          <button className="btn-primary">Exportar Excel</button>
          <button className="btn-primary">Imprimir</button>
        </div>
      </div>

      <div className="summary">

        <div className="summary-card">
          <span>Pedidos</span>
          <h2>18</h2>
        </div>

        <div className="summary-card">
          <span>Pendientes</span>
          <h2>6</h2>
        </div>

        <div className="summary-card">
          <span>Rotiserías</span>
          <h2>3</h2>
        </div>

      </div>

      <div className="pending-card">
        <h2>Usuarios pendientes</h2>

        <ul>
          <li>Juan Pérez</li>
          <li>María Gómez</li>
          <li>Pedro Ruiz</li>
          <li>Carlos Fernández</li>
          <li>Lucía Gómez</li>
          <li>Ana López</li>
        </ul>
      </div>

      <div className="tabs">
        <button className="active">Todas</button>
        <button>Brisari</button>
        <button>Mary</button>
        <button>Roti Ensaladas</button>
      </div>

      <table>

        <thead>
          <tr>
            <th>Empresa</th>
            <th>Usuario</th>
            <th>Rotisería</th>
            <th>Pedido</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Nasini</td>
            <td>Juan Pérez</td>
            <td>Brisari</td>
            <td>Menú 1 con puré</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Ana Gómez</td>
            <td>Mary</td>
            <td>Ravioles</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Pedro Ruiz</td>
            <td>Roti Ensaladas</td>
            <td>Serrana</td>
          </tr>

          <tr>
            <td>Nasini</td>
            <td>Carlos Fernández</td>
            <td>Brisari</td>
            <td>Milanesa napolitana</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Lucía Gómez</td>
            <td>Mary</td>
            <td>Pollo al champiñón</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Diego López</td>
            <td>Brisari</td>
            <td>Menú 2</td>
          </tr>

          <tr>
            <td>Nasini</td>
            <td>Sofía Martínez</td>
            <td>Roti Ensaladas</td>
            <td>Caesar</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Martín Díaz</td>
            <td>Mary</td>
            <td>Bombas de papa</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Laura Sánchez</td>
            <td>Brisari</td>
            <td>Menú 3</td>
          </tr>

          <tr>
            <td>Nasini</td>
            <td>Nicolás Romero</td>
            <td>Roti Ensaladas</td>
            <td>Completa</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Julieta Ruiz</td>
            <td>Mary</td>
            <td>Tarta de jamón</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Pablo Acosta</td>
            <td>Brisari</td>
            <td>Menú 1</td>
          </tr>

          <tr>
            <td>Nasini</td>
            <td>Valeria Castro</td>
            <td>Roti Ensaladas</td>
            <td>Mediterránea</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Andrés Molina</td>
            <td>Mary</td>
            <td>Zapallitos rellenos</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Camila Ortiz</td>
            <td>Brisari</td>
            <td>Menú 2 con papas</td>
          </tr>

          <tr>
            <td>Nasini</td>
            <td>Federico Gómez</td>
            <td>Brisari</td>
            <td>Menú 1</td>
          </tr>

          <tr>
            <td>Mutual</td>
            <td>Carla Benítez</td>
            <td>Roti Ensaladas</td>
            <td>Vegetariana</td>
          </tr>

          <tr>
            <td>Market Hub</td>
            <td>Gabriel Suárez</td>
            <td>Mary</td>
            <td>Ravioles con salsa mixta</td>
          </tr>
        </tbody>

      </table>

    </div>
  );
}