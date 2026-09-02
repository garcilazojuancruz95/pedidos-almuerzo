import { supabase } from "../lib/supabase";

function obtenerFechaLocal() {
  const ahora = new Date();

  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

export async function marcarHomeOffice(usuarioId) {
  const hoy = obtenerFechaLocal();

  const { error } = await supabase
    .from("home_office")
    .upsert(
      {
        usuario_id: usuarioId,
        fecha: hoy,
      },
      {
        onConflict: "usuario_id,fecha",
        ignoreDuplicates: true,
      }
    );

  if (error) {
    throw error;
  }
}

export async function quitarHomeOffice(usuarioId) {
  const hoy = obtenerFechaLocal();

  const { error } = await supabase
    .from("home_office")
    .delete()
    .eq("usuario_id", usuarioId)
    .eq("fecha", hoy);

  if (error) {
    throw error;
  }
}

export async function estaEnHomeOffice(usuarioId) {
  const hoy = obtenerFechaLocal();

  const { data, error } = await supabase
    .from("home_office")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("fecha", hoy)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function obtenerHomeOfficeDelDia() {
  const hoy = obtenerFechaLocal();

  const { data, error } = await supabase
    .from("home_office")
    .select(`
      *,
      usuarios(
        *,
        empresas(*),
        roles(*)
      )
    `)
    .eq("fecha", hoy);

  if (error) {
    throw error;
  }

  return data;
}