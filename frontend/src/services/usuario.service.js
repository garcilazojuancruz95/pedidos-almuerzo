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

export async function obtenerUsuarioPorEmail(email) {
  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    throw error;
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
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerEmpresaPorNombre(nombre) {
  const { data, error } = await supabase
    .from("empresas")
    .select("id, nombre")
    .ilike("nombre", nombre)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function actualizarUsuario(usuarioId, cambios) {
  const { data, error } = await supabase
    .from("usuarios")
    .update({
      nombre: cambios.nombre,
      apellido: cambios.apellido,
      email: cambios.email,
      empresa_id: cambios.empresaId,
      rol_id: cambios.rolId,
      activo: cambios.activo,
    })
    .eq("id", usuarioId)
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function importarEmpleado(empleado) {
  const empresa = await obtenerEmpresaPorNombre(empleado.division);

  if (!empresa) {
    throw new Error(
      `No se encontró la empresa "${empleado.division}".`
    );
  }

  // Obtener el rol Empleado para nuevos registros
  const rolEmpleado = await obtenerRolEmpleado();

  // 1. Buscar por PeopleForce ID
  const { data: usuarioPorPeopleForce, error: errorPeopleForce } =
    await supabase
      .from("usuarios")
      .select("*")
      .eq("peopleforce_id", empleado.peopleforce_id)
      .maybeSingle();

  if (errorPeopleForce) {
    throw errorPeopleForce;
  }

  let existente = usuarioPorPeopleForce;

  // 2. Si no existe, buscar por email
  if (!existente) {
    const { data: usuarioPorEmail, error: errorEmail } =
      await supabase
        .from("usuarios")
        .select("*")
        .ilike("email", empleado.email)
        .maybeSingle();

    if (errorEmail) {
      throw errorEmail;
    }

    existente = usuarioPorEmail;
  }

  // 3. Si ya existe, actualizarlo
  if (existente) {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        peopleforce_id: empleado.peopleforce_id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
        empresa_id: empresa.id,
      })
      .eq("id", existente.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      tipo: "actualizado",
      usuario: data,
    };
  }

  // 4. Si no existe, crear nuevo empleado
  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      peopleforce_id: empleado.peopleforce_id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      empresa_id: empresa.id,
      rol_id: rolEmpleado.id,
      activo: true,
      auth_user_id: null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    tipo: "nuevo",
    usuario: data,
  };
}

export async function obtenerEmpresas() {
  const { data, error } = await supabase
    .from("empresas")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerRolEmpleado() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, nombre")
    .eq("nombre", "Empleado")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function crearUsuario({
  nombre,
  apellido,
  email,
  empresaId,
  rolId,
}) {
  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      nombre,
      apellido,
      email,
      empresa_id: empresaId,
      rol_id: rolId,
      activo: true,
    })
    .select(`
      *,
      roles(*),
      empresas(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
}