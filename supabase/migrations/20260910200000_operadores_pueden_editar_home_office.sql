-- Las politicas existentes de home_office solo dejaban insertar/eliminar
-- el propio registro del empleado (self-service). El operador no tenia
-- forma de marcar/desmarcar home office por otro usuario desde el listado
-- de pendientes, y la insercion fallaba con "new row violates row-level
-- security policy" (42501).
CREATE POLICY "Operadores pueden crear home office"
  ON public.home_office
  FOR INSERT
  TO authenticated
  WITH CHECK (public.es_operador());

CREATE POLICY "Operadores pueden eliminar home office"
  ON public.home_office
  FOR DELETE
  TO authenticated
  USING (public.es_operador());
