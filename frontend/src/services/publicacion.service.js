import { supabase } from "../lib/supabase";

function obtenerFechaHoyArgentina() {
  const hoy = new Date();

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(hoy);
}

export async function obtenerPublicaciones() {
  const fechaHoy = obtenerFechaHoyArgentina();

  const { data, error } = await supabase
    .from("publicaciones")
    .select(`
      *,
      rotiserias(*),
      usuarios(*),
      publicacion_imagenes(*)
    `)
    .eq("fecha", fechaHoy)
    .order("rotiserias(nombre)", { ascending: true });

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
    menuTexto,
    aclaraciones,
  }
) {
  const { data, error } = await supabase
    .from("publicaciones")
    .update({
      rotiseria_id: rotiseriaId,
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

export async function eliminarImagenPublicacion(imagen) {
  const prefijo = "/storage/v1/object/public/publicaciones/";

  if (!imagen.url.includes(prefijo)) {
    throw new Error("No se pudo determinar la ruta de la imagen.");
  }

  const ruta = decodeURIComponent(
    imagen.url.split(prefijo)[1]
  );

  const { error: errorStorage } = await supabase.storage
    .from("publicaciones")
    .remove([ruta]);

  if (errorStorage) {
    throw errorStorage;
  }

  const { error: errorBaseDatos } = await supabase
    .from("publicacion_imagenes")
    .delete()
    .eq("id", imagen.id);

  if (errorBaseDatos) {
    throw errorBaseDatos;
  }
}

export async function obtenerPublicacionPorRotiseriaYFecha(
  rotiseriaId,
  fecha
) {
  const { data, error } = await supabase
    .from("publicaciones")
    .select(`
      id,
      fecha,
      rotiserias(nombre)
    `)
    .eq("rotiseria_id", rotiseriaId)
    .eq("fecha", fecha)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}