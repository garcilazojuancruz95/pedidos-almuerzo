-- Pedidos fijos: un pedido por defecto que se carga solo para un empleado
-- cada dia, para no depender de que el operador se acuerde de cargarselo a
-- mano. Se auto-completa desde el frontend (Pedidos del dia) cuando esa
-- persona todavia no tiene un pedido cargado ese dia y no esta en Home
-- Office.
create table if not exists public.pedidos_fijos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  rotiseria_id uuid not null references public.rotiserias(id) on delete restrict,
  pedido text not null,
  activo boolean not null default true,
  creado_en timestamp without time zone not null default now(),
  unique (usuario_id)
);

alter table public.pedidos_fijos enable row level security;

create policy "Operadores y administradores pueden ver pedidos fijos"
  on public.pedidos_fijos for select
  to authenticated
  using (public.es_operador());

create policy "Operadores y administradores pueden crear pedidos fijos"
  on public.pedidos_fijos for insert
  to authenticated
  with check (public.es_operador());

create policy "Operadores y administradores pueden actualizar pedidos fijos"
  on public.pedidos_fijos for update
  to authenticated
  using (public.es_operador())
  with check (public.es_operador());

create policy "Operadores y administradores pueden eliminar pedidos fijos"
  on public.pedidos_fijos for delete
  to authenticated
  using (public.es_operador());

-- Carga el caso puntual de Maira Roatta: siempre pide "Menu sin TACC" a Saona.
insert into public.pedidos_fijos (usuario_id, rotiseria_id, pedido)
select u.id, r.id, 'Menú sin TACC'
from public.usuarios u
cross join public.rotiserias r
where lower(u.email) = 'maira.roatta@nasini.com.ar'
  and r.nombre = 'Saona'
on conflict (usuario_id) do nothing;
