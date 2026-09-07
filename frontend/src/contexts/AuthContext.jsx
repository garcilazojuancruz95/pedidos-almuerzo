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

import { supabase } from "../lib/supabase";

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

    let usuario = await obtenerUsuarioPorAuthId(session.user.id);

    if (!usuario) {
      const { error } = await supabase.rpc(
        "vincular_usuario_actual"
      );

      if (error) {
        throw error;
      }

      usuario = await obtenerUsuarioPorAuthId(session.user.id);
    }

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
    function limpiarHashDeAutenticacion() {
      if (!window.location.hash.includes("access_token=")) {
        return;
      }

      window.history.replaceState(
        null,
        document.title,
        `${window.location.pathname}${window.location.search}`
      );
    }

    async function manejarSesion(session) {
      setSession(session);

      try {
        await cargarUsuario(session);
      } catch (error) {
        console.error("Error al validar la sesion:", error);
        setSession(null);
        setUsuario(null);
        setMensajeAcceso("No se pudo validar tu sesion. Volve a iniciar sesion.");
      } finally {
        limpiarHashDeAutenticacion();
        setLoading(false);
      }
    }

    async function iniciar() {
      try {
        const session = await getSession();

        await manejarSesion(session);
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
      await manejarSesion(session);
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
