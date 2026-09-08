# Infraestructura de pedidos-almuerzo

Una única instancia EC2 (Amazon Linux 2023) corre el `docker-compose.yml` del
repo tal cual (frontend + stack self-hosted completo de Supabase), con Caddy
como proxy TLS delante (certificado propio vía Let's Encrypt, renovado solo).

No hay SSH: el acceso administrativo es por **AWS SSM Session Manager**:

```bash
aws ssm start-session --target <instance-id> --region us-east-1
```

## Qué gestiona Terraform

- VPC dedicada (10.50.0.0/24), subnet pública, security group (solo 80/443 entrantes).
- La instancia EC2, su Elastic IP y su IAM role (SSM + lectura de sus propios secrets).
- El registro DNS `pedidos.nasini.com.ar` en la zona `nasini.com.ar` ya existente.
- Dos secrets en Secrets Manager **vacíos** (`pedidos-almuerzo/git-deploy-key` y
  `pedidos-almuerzo/supabase-env`) — el valor real nunca pasa por Terraform ni
  por el state (ver más abajo).
- Una política IAM nueva sobre el rol OIDC `github-actions-pedidos-almuerzo-deploy`
  que ya usa `deploy.yml` (no se toca su trust policy ni su política actual de ECR).

`terraform apply` corre solo desde GitHub Actions (`.github/workflows/infra.yml`,
push a `prod` que toque `infra/**`), nunca a mano desde una laptop.

## Setup inicial (una sola vez)

### 1. Deploy key de solo lectura para la instancia

Ya se generó un par de claves y se le pidió al dueño del repo agregar la
pública como Deploy Key **sin** write access. La privada nunca se commitea.

### 2. Correr `terraform apply` (vía `infra.yml`)

Push a `prod` con los archivos de `infra/`. Esto crea la instancia y los dos
secrets vacíos.

### 3. Cargar el valor real de los secrets

Recién ahora existen los secrets en AWS. Cargar los valores reales a mano
(una sola vez, no vuelve a pasar por git):

```bash
# Clave privada de solo lectura (la que se agregó como Deploy Key en el paso 1)
aws secretsmanager put-secret-value \
  --secret-id pedidos-almuerzo/git-deploy-key \
  --secret-string file:///ruta/a/la/clave_privada_readonly

# Variables del stack de Supabase: generarlas con el script que ya trae el repo
cp supabase-docker/.env.example supabase-docker/.env
sh supabase-docker/utils/generate-keys.sh --update-env   # corridas desde supabase-docker/
# Reemplazar localhost por el dominio público:
sed -i 's#http://localhost:8000#https://pedidos.nasini.com.ar#g; s#http://localhost:3000#https://pedidos.nasini.com.ar#g' supabase-docker/.env

aws secretsmanager put-secret-value \
  --secret-id pedidos-almuerzo/supabase-env \
  --secret-string file://supabase-docker/.env

# Borrar el .env local generado, ya cumplió su función
rm supabase-docker/.env
```

### 4. Recrear la instancia para que tome los secrets reales

El `user_data` solo corre en el primer boot, y ya corrió con los secrets
placeholder. Forzar un relanzamiento:

```bash
terraform -chdir=infra taint aws_instance.app
```

y volver a pushear a `prod` (o `workflow_dispatch` en `infra.yml`).

### 5. Variables de build del frontend (Vite las compila en build-time)

En **Settings → Secrets and variables → Actions** del repo:

- Variable `VITE_SUPABASE_URL` = `https://pedidos.nasini.com.ar`
- Secret `VITE_SUPABASE_ANON_KEY` = el `ANON_KEY` generado en el paso 3

Sin esto, `deploy.yml` construye la imagen del frontend sin poder hablar con
Supabase.

## Deploys normales (después del setup inicial)

- Cambios de código del frontend → push a `prod` → `deploy.yml` buildea,
  pushea a ECR y redespliega solo el contenedor `frontend` vía SSM.
- Cambios de infraestructura → push a `prod` tocando `infra/**` → `infra.yml`
  corre `terraform apply`.
- Cambios al stack de Supabase (migraciones, `docker-compose.yml`, `Caddyfile`)
  hoy no tienen pipeline propio: conectarse por SSM y correr
  `git pull && docker compose up -d` a mano en `/opt/pedidos-almuerzo`.
