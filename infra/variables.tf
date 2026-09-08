variable "aws_region" {
  description = "Región de AWS donde se crea la infraestructura."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del ambiente."
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "Tipo de instancia EC2 para correr el docker-compose completo (frontend + Supabase self-hosted)."
  type        = string
  default     = "t3.small"
}

variable "root_volume_size" {
  description = "Tamaño en GB del volumen EBS raíz (ahí vive el volumen de Postgres y el storage de Supabase)."
  type        = number
  default     = 50
}

variable "domain_name" {
  description = "Dominio completo para el frontend."
  type        = string
  default     = "pedidos.nasini.com.ar"
}

variable "root_hosted_zone" {
  description = "Zona Route53 raíz ya existente donde se crea el registro del dominio."
  type        = string
  default     = "nasini.com.ar"
}

variable "vpc_cidr" {
  description = "Rango CIDR de la VPC dedicada."
  type        = string
  default     = "10.50.0.0/24"
}

variable "public_subnet_cidr" {
  description = "Rango CIDR de la subnet pública."
  type        = string
  default     = "10.50.0.0/26"
}

variable "availability_zone" {
  description = "AZ donde se crea la subnet pública."
  type        = string
  default     = "us-east-1a"
}

variable "letsencrypt_email" {
  description = "Email usado por Caddy para registrar los certificados Let's Encrypt."
  type        = string
  default     = "sistemas@nasini.com.ar"
}

variable "github_actions_role_name" {
  description = "Nombre del rol OIDC de GitHub Actions ya existente al que se le agregan permisos de infra."
  type        = string
  default     = "github-actions-pedidos-almuerzo-deploy"
}
