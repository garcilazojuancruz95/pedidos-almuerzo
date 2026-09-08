#!/bin/bash
# Aplica los archivos de supabase/migrations/ que todavía no corrieron contra
# la base de este host, en orden, cada uno en su propia transacción. Lleva el
# registro en public._migrations_applied para no reaplicar los que ya corrieron.
#
# Se ejecuta en la instancia (tiene acceso a "docker exec supabase-db"), ya
# sea a mano por SSM o disparado por .github/workflows/migrate.yml.
set -euo pipefail
cd "$(dirname "$0")/.."

PSQL="docker exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1"

$PSQL -c "CREATE TABLE IF NOT EXISTS public._migrations_applied (
  filename text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);"

for f in supabase/migrations/*.sql; do
  name=$(basename "$f")
  already=$($PSQL -tAc "SELECT 1 FROM public._migrations_applied WHERE filename = '$name';")

  if [ "$already" = "1" ]; then
    echo "skip (ya aplicada): $name"
    continue
  fi

  echo "aplicando: $name"
  $PSQL --single-transaction < "$f"
  $PSQL -c "INSERT INTO public._migrations_applied (filename) VALUES ('$name');"
done
