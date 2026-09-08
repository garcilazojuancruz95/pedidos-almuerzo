data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_iam_role" "instance" {
  name = "pedidos-almuerzo-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "ecr_pull" {
  name = "ecr-pull-frontend"
  role = aws_iam_role.instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "EcrAuth"
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Sid    = "EcrPull"
        Effect = "Allow"
        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability",
        ]
        Resource = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/pedidos-almuerzo-frontend"
      }
    ]
  })
}

resource "aws_iam_role_policy" "read_own_secrets" {
  name = "read-secrets"
  role = aws_iam_role.instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["secretsmanager:GetSecretValue"]
      Resource = [
        aws_secretsmanager_secret.git_deploy_key.arn,
        aws_secretsmanager_secret.supabase_env.arn,
      ]
    }]
  })
}

resource "aws_iam_instance_profile" "instance" {
  name = "pedidos-almuerzo-ec2-profile"
  role = aws_iam_role.instance.name
}

locals {
  user_data = templatefile("${path.module}/templates/user_data.sh.tpl", {
    aws_region            = var.aws_region
    git_deploy_key_secret = aws_secretsmanager_secret.git_deploy_key.name
    supabase_env_secret   = aws_secretsmanager_secret.supabase_env.name
    domain_name           = var.domain_name
    letsencrypt_email     = var.letsencrypt_email
    repo_ssh_url          = var.repo_ssh_url
  })
}

resource "aws_instance" "app" {
  ami                    = data.aws_ssm_parameter.al2023_ami.value
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app.id]
  iam_instance_profile   = aws_iam_instance_profile.instance.name
  user_data              = local.user_data

  # El user_data solo corre en el primer boot. Los deploys posteriores
  # los dispara deploy.yml vía SSM (git pull + docker compose up -d).
  user_data_replace_on_change = false

  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
  }

  metadata_options {
    http_tokens = "required" # IMDSv2 obligatorio
  }

  tags = {
    Name = "pedidos-almuerzo-app"
  }

  lifecycle {
    # El AMI "latest" de SSM cambia cada pocas semanas. infra.yml corre
    # terraform apply -auto-approve sin revisión humana: si no ignoramos el
    # drift del AMI, cualquier apply de rutina reemplazaría la instancia y
    # se perdería el volumen con Postgres y los certificados de Caddy.
    ignore_changes = [ami]
  }
}

resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = {
    Name = "pedidos-almuerzo-eip"
  }
}
