import "./Login.css";

import { signInWithGoogle } from "../../services/auth.service";

export default function Login() {
  async function handleLogin() {
    console.log("Click en botón");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/images/logo-nasini.svg"
          alt="Nasini"
          className="login-logo"
        />

        <h1>Plataforma de Pedidos de Almuerzo</h1>

        <p>Iniciá sesión con tu cuenta de Google Workspace.</p>

        <button onClick={handleLogin}>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}