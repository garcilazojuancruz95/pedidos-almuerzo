CREATE OR REPLACE FUNCTION public.es_operador() RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuarios u
    JOIN public.roles r ON r.id = u.rol_id
    WHERE u.auth_user_id = auth.uid()
      AND u.activo = true
      AND r.nombre IN ('Operador', 'Administrador')
  );
$$;
