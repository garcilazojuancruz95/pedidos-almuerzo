#!/bin/bash
# Bootstrap que corre una única vez, en el primer boot de la instancia.
# Los deploys posteriores los dispara deploy.yml vía "aws ssm send-command"
# (git pull + docker compose pull + docker compose up -d), no este script.
set -euxo pipefail

exec > >(tee /var/log/user-data.log) 2>&1

AWS_REGION="${aws_region}"
GIT_DEPLOY_KEY_SECRET="${git_deploy_key_secret}"
SUPABASE_ENV_SECRET="${supabase_env_secret}"
DOMAIN_NAME="${domain_name}"
LETSENCRYPT_EMAIL="${letsencrypt_email}"
REPO_SSH_URL="${repo_ssh_url}"
APP_DIR="/opt/pedidos-almuerzo"

dnf install -y docker git

systemctl enable --now docker

# Docker Compose v2 no viene empaquetado en los repos de AL2023: se instala el
# plugin oficial directo desde las releases de Docker.
mkdir -p /usr/local/lib/docker/cli-plugins
curl -fsSL "https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# --- Clave SSH de solo lectura para git pull ---
mkdir -p /root/.ssh
chmod 700 /root/.ssh
ssh-keyscan -t ed25519 github.com >> /root/.ssh/known_hosts 2>/dev/null

aws secretsmanager get-secret-value \
  --region "$AWS_REGION" \
  --secret-id "$GIT_DEPLOY_KEY_SECRET" \
  --query SecretString --output text > /root/.ssh/id_ed25519_pedidos_almuerzo
chmod 600 /root/.ssh/id_ed25519_pedidos_almuerzo

cat > /root/.ssh/config <<EOF
Host github.com
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_ed25519_pedidos_almuerzo
  IdentitiesOnly yes
EOF
chmod 600 /root/.ssh/config

# --- Código de la app ---
git clone "$REPO_SSH_URL" "$APP_DIR"
git -C "$APP_DIR" checkout prod

# --- Variables de entorno del stack Supabase (self-hosted) ---
aws secretsmanager get-secret-value \
  --region "$AWS_REGION" \
  --secret-id "$SUPABASE_ENV_SECRET" \
  --query SecretString --output text > "$APP_DIR/supabase-docker/.env"

# --- Variables de entorno para Caddy (dominio propio, no secretas) ---
cat > "$APP_DIR/.env" <<EOF
DOMAIN=$DOMAIN_NAME
LETSENCRYPT_EMAIL=$LETSENCRYPT_EMAIL
EOF

# El servicio "frontend" tiene "image" apuntando a ECR (repo privado): sin
# login, "docker compose up" no puede pullearlo aunque el rol de la instancia
# ya tenga permiso de lectura sobre el repo.
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com"

cd "$APP_DIR"
docker compose up -d
