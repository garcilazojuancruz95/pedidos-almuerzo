import { createContext, useContext, useEffect, useState } from "react";

import {
  getSession,
  onAuthStateChange,
  signOut,
} from "../services/auth.service";

import {
  obtenerUsuarioPorAuthId,
  usuarioPuedeIngresar,
} from "../services/usuario.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensajeAcceso, setMensajeAcceso] = useState("");

  async function cargarUsuario(session) {
    if (!session?.user) {
      setUsuario(null);
      setMensajeAcceso("");
      return;
    }

    const usuario = await obtenerUsuarioPorAuthId(session.user.id);

    const resultado = usuarioPuedeIngresar(usuario);

    if (!resultado.ok) {
      setMensajeAcceso(resultado.mensaje);

      await signOut();

      setUsuario(null);
      return;
    }

    setMensajeAcceso("");
    setUsuario(usuario);
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const session = await getSession();

        setSession(session);

        await cargarUsuario(session);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setSession(null);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    }

    iniciar();

    const {
      data: { subscription },
    } = onAuthStateChange(async (_event, session) => {
      setSession(session);

      await cargarUsuario(session);

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        usuario,
        loading,
        mensajeAcceso,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}