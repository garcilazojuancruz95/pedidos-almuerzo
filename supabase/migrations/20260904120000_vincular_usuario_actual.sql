-- Links pre-existing auth users to imported users without exposing user rows
-- or allowing a client to choose which account is linked.
create or replace function public.vincular_usuario_actual()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  filas_actualizadas bigint;
begin
  if auth.uid() is null or coalesce(auth.jwt() ->> 'email', '') = '' then
    return false;
  end if;

  update public.usuarios
  set auth_user_id = auth.uid()
  where lower(email) = lower(auth.jwt() ->> 'email')
    and auth_user_id is null;

  get diagnostics filas_actualizadas = row_count;
  return filas_actualizadas > 0;
end;
$$;

revoke all on function public.vincular_usuario_actual() from public;
grant execute on function public.vincular_usuario_actual() to authenticated;
