# Los secrets se crean vacíos por Terraform. El valor real se carga una única
# vez a mano (aws secretsmanager put-secret-value) y nunca vuelve a pasar por
# Terraform ni por el state, para no dejar credenciales en git ni en el backend S3.

resource "aws_secretsmanager_secret" "git_deploy_key" {
  name        = "pedidos-almuerzo/git-deploy-key"
  description = "Clave privada SSH de solo lectura para que la instancia haga git pull del repo."
}

resource "aws_secretsmanager_secret_version" "git_deploy_key_placeholder" {
  secret_id     = aws_secretsmanager_secret.git_deploy_key.id
  secret_string = "REPLACE_ME"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret" "supabase_env" {
  name        = "pedidos-almuerzo/supabase-env"
  description = "Contenido completo del archivo supabase-docker/.env (POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, etc.), como texto plano."
}

resource "aws_secretsmanager_secret_version" "supabase_env_placeholder" {
  secret_id     = aws_secretsmanager_secret.supabase_env.id
  secret_string = "REPLACE_ME"

  lifecycle {
    ignore_changes = [secret_string]
  }
}
