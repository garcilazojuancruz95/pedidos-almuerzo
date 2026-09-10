-- Deja en produccion solo estas 4 rotiserias: Saona, Don Viandero, Mary,
-- Ensaladas. "Roti Ensaladas" pasa a llamarse "Ensaladas" (se mantiene el
-- mismo id para no romper pedidos/publicaciones ya asociados). "Brisari" se
-- da de baja por completo junto con su unica publicacion asociada (no tenia
-- pedidos ni imagenes).

DELETE FROM pedidos
WHERE rotiseria_id IN (SELECT id FROM rotiserias WHERE nombre = 'Brisari');

DELETE FROM publicaciones
WHERE rotiseria_id IN (SELECT id FROM rotiserias WHERE nombre = 'Brisari');

DELETE FROM rotiserias
WHERE nombre = 'Brisari';

UPDATE rotiserias
SET nombre = 'Ensaladas'
WHERE nombre = 'Roti Ensaladas';

INSERT INTO rotiserias (nombre)
VALUES ('Saona'), ('Don Viandero')
ON CONFLICT (nombre) DO NOTHING;
