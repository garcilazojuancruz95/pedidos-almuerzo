-- Si el operador elimina el pedido auto-generado (o cualquier pedido) de un
-- usuario con un pedido fijo activo, no queremos que se vuelva a crear solo
-- si recarga la pagina ese mismo dia. Guardamos la fecha en la que se
-- "salteo" y el auto-completado la compara contra la fecha de hoy: al otro
-- dia, como la fecha ya no coincide, el pedido fijo vuelve a crearse solo.
alter table public.pedidos_fijos
  add column if not exists omitido_el date;
