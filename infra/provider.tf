provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "pedidos-almuerzo"
      Repository  = "nasini-organization/pedidos-almuerzo"
      ManagedBy   = "terraform"
      Environment = var.environment
    }
  }
}

data "aws_caller_identity" "current" {}
