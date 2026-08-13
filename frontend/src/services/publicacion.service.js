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