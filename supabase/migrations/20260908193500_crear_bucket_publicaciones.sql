-- El bucket "publicaciones" existia en el proyecto viejo de Supabase Cloud
-- (creado a mano desde el dashboard) pero nunca quedo en una migracion, asi
-- que no existe en la base self-hosted nueva y la subida de imagenes falla
-- con "Bucket not found".
INSERT INTO storage.buckets (id, name, public)
VALUES ('publicaciones', 'publicaciones', true)
ON CONFLICT (id) DO NOTHING;
