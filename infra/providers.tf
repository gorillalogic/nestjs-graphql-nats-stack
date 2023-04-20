terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"

  # See config.s3.tfbackend.example
  backend "s3" {}
}

provider "aws" {
  region  = "us-east-1"
  default_tags {
    tags = {
      Environment = var.environment
      Owner = "Emmanuel Mora"
      Project = "Labs"
      "Application ID" = "nestjs-graphql-nats"
    }
  }
}
