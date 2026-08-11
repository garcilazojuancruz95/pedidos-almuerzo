import { supabase } from "../lib/supabase";

export async function obtenerUsuarioPorAuthId(authUserId) {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .eq("auth_user_id", authUserId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function obtenerUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .order("apellido", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export function usuarioPuedeIngresar(usuario) {
  if (!usuario) {
    return {
      ok: false,
      mensaje: "No tenés permisos para acceder a la plataforma.",
    };
  }

  if (!usuario.activo) {
    return {
      ok: false,
      mensaje: "Tu usuario se encuentra deshabilitado.",
    };
  }

  return {
    ok: true,
    mensaje: "",
  };
}

export async function cambiarEstadoUsuario(usuarioId, activo) {
  const { data, error } = await supabase
    .from("usuarios")
    .update({ activo })
    .eq("id", usuarioId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}