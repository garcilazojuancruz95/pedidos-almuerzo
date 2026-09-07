create or replace function public.vincular_usuario_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.usuarios
  set auth_user_id = new.id
  where lower(email) = lower(new.email)
    and auth_user_id is null;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.vincular_usuario_auth();
