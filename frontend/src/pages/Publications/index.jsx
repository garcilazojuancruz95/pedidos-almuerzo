import "./Publications.css";

import brisariImg from "../../assets/images/brisari.png";
import ensaladasImg from "../../assets/images/ensaladas.png";

export default function Publications() {
  return (
    <div className="publications">

      <div className="page-header">
        <h1>Publicaciones del día</h1>

        <button className="btn-primary">
          + Nueva publicación
        </button>
      </div>

      <div className="publication-card">

        <div className="publication-top">

          <h2>🍽 Brisari</h2>

          <div className="actions">
            <button>Editar</button>
            <button>Eliminar</button>
          </div>

        </div>

        <img src={brisariImg} alt="Brisari" />

      </div>

      <div className="publication-card">

        <div className="publication-top">

          <h2>🥗 Roti Ensaladas</h2>

          <div className="actions">
            <button>Editar</button>
            <button>Eliminar</button>
          </div>

        </div>

        <img src={ensaladasImg} alt="Ensaladas" />

      </div>

      <div className="publication-card">

        <div className="publication-top">

          <h2>🍲 Mary</h2>

          <div className="actions">
            <button>Editar</button>
            <button>Eliminar</button>
          </div>

        </div>

        <pre>

{`Buen día

Tarta de jamón, queso, tomate y huevo c/guarnición

Pollo al champiñón c/guarnición

Ravioles de ricota

Bombas de papa

Zapallitos rellenos
`}

        </pre>

      </div>

    </div>
  );
}