-- Al editar el email de un usuario desde la app, el auth_user_id vinculado
-- queda apuntando a la cuenta de Google vieja, y la persona no puede volver
-- a entrar hasta que alguien lo resetee a mano. Este trigger lo hace solo:
-- si el email cambia, limpia auth_user_id para que la proxima vez que esa
-- persona inicie sesion con el email nuevo, vincular_usuario_actual() la
-- vuelva a vincular automaticamente.
create or replace function public.resetear_auth_id_si_cambia_email()
returns trigger
language plpgsql
as $$
begin
  if lower(new.email) is distinct from lower(old.email) then
    new.auth_user_id := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_resetear_auth_id_si_cambia_email on public.usuarios;

create trigger trg_resetear_auth_id_si_cambia_email
before update on public.usuarios
for each row
execute function public.resetear_auth_id_si_cambia_email();
