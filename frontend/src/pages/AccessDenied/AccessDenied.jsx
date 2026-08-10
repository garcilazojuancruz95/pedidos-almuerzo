import "./AccessDenied.css";

export default function AccessDenied({ mensaje }) {
  return (
    <div className="access-denied">
      <div className="card">
        <h1>Acceso denegado</h1>

        <p>{mensaje}</p>

        <p>
          Si creés que se trata de un error, comunicate con un operador.
        </p>
      </div>
    </div>
  );
}