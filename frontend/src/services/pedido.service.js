import { supabase } from "../lib/supabase";

const HORA_LIMITE_PEDIDOS = "11:15";

function obtenerHoraActualArgentina() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function haPasadoHoraLimitePedidos() {
  if (import.meta.env.VITE_DESHABILITAR_HORARIO_LIMITE === "true") {
    return false;
  }

  return obtenerHoraActualArgentina() >= HORA_LIMITE_PEDIDOS;
}

export async function obtenerPedidosDelDia() {
  const fechaHoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      *,
      usuarios (
        nombre,
        apellido,
        empresa_id,
        empresas (
          nombre
        )
      ),
      rotiserias (
        nombre
      )
    `)
    .eq("fecha", fechaHoy)
    .order("fecha_creacion", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function crearPedido({
  usuarioId,
  rotiseriaId,
  pedido,
}) {
  const fechaHoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

  const { data, error } = await supabase
    .from("pedidos")
    .insert({
      usuario_id: usuarioId,
      rotiseria_id: rotiseriaId,
      pedido,
      fecha: fechaHoy,
    })
    .select(`
      *,
      rotiserias (
        id,
        nombre
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
export async function obtenerMisPedidosDelDia(usuarioId) {
  const fechaHoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      *,
      rotiserias (
        id,
        nombre
      )
    `)
    .eq("usuario_id", usuarioId)
    .eq("fecha", fechaHoy)
    .order("fecha_creacion", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarPedido(
  pedidoId,
  textoPedido
) {
  const { data, error } = await supabase
    .from("pedidos")
    .update({
      pedido: textoPedido,
      fecha_modificacion: new Date().toISOString(),
    })
    .eq("id", pedidoId)
    .select(`
      *,
      rotiserias (
        id,
        nombre
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function eliminarPedido(pedidoId) {
  const { error } = await supabase
    .from("pedidos")
    .delete()
    .eq("id", pedidoId);

  if (error) {
    throw error;
  }
}