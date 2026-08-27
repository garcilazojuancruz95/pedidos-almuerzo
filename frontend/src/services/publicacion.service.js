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

export async function eliminarPublicacion(publicacionId) {
  const { error } = await supabase
    .from("publicaciones")
    .delete()
    .eq("id", publicacionId);

  if (error) {
    throw error;
  }
}

export async function subirImagenPublicacion(
  archivo,
  publicacionId
) {
  const extension = archivo.name.split(".").pop();

  const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

  const ruta = `${publicacionId}/${nombreArchivo}`;

  const { error } = await supabase.storage
    .from("publicaciones")
    .upload(ruta, archivo, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("publicaciones")
    .getPublicUrl(ruta);

  return {
    ruta,
    url: publicUrl,
  };
}

export async function guardarImagenPublicacion(
  publicacionId,
  url,
  orden
) {
  const { data, error } = await supabase
    .from("publicacion_imagenes")
    .insert({
      publicacion_id: publicacionId,
      url,
      orden,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}