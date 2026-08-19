import { supabase } from "../lib/supabase";

export async function obtenerPublicaciones() {
  const { data, error } = await supabase
    .from("publicaciones")
    .select(`
      *,
      rotiserias(*),
      usuarios(*),
      publicacion_imagenes(*)
    `)
    .order("fecha", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerRotiserias() {
  const { data, error } = await supabase
    .from("rotiserias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function crearPublicacion({
  rotiseriaId,
  fecha,
  menuTexto,
  aclaraciones,
  publicadoPor,
}) {
  const { data, error } = await supabase
    .from("publicaciones")
    .insert({
      rotiseria_id: rotiseriaId,
      fecha,
      menu_texto: menuTexto,
      aclaraciones,
      publicado_por: publicadoPor,
    })
    .select(`
      *,
      rotiserias(*),
      usuarios(*),
      publicacion_imagenes(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarPublicacion(
  publicacionId,
  {
    rotiseriaId,
    fecha,
    menuTexto,
    aclaraciones,
  }
) {
  const { data, error } = await supabase
    .from("publicaciones")
    .update({
      rotiseria_id: rotiseriaId,
      fecha,
      menu_texto: menuTexto,
      aclaraciones,
    })
    .eq("id", publicacionId)
    .select(`
      *,
      rotiserias(*),
      usuarios(*),
      publicacion_imagenes(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}