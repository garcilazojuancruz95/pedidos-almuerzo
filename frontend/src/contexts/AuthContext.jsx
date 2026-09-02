import { createContext, useContext, useEffect, useState } from "react";

import {
  getSession,
  onAuthStateChange,
  signOut,
} from "../services/auth.service";

import {
  obtenerUsuarioPorAuthId,
  obtenerUsuarioPorEmail,
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
      usuario = await obtenerUsuarioPorEmail(
        session.user.email
      );

      if (usuario) {
        const { data, error } = await supabase
          .from("usuarios")
          .update({
            auth_user_id: session.user.id,
          })
          .eq("id", usuario.id)
          .select(`
            *,
            roles(*),
            empresas(*)
          `)
          .single();

        if (error) {
          throw error;
        }

        usuario = data;
      }
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