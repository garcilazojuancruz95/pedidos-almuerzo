-- La empresa "Mutual" paso a llamarse "AMEPE". Se actualiza el nombre en
-- lugar de crear una empresa nueva para no romper el vinculo con los
-- usuarios y pedidos ya asociados a ese empresa_id.
UPDATE empresas
SET nombre = 'AMEPE'
WHERE nombre = 'Mutual';
