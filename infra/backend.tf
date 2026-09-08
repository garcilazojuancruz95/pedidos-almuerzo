terraform {
  required_version = ">= 1.6"

  backend "s3" {
    bucket         = "terraform-tfstate-nasini"
    key            = "pedidos-almuerzo/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
