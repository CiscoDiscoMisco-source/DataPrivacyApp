terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    # This will be configured in each environment
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "data-privacy-app"
}

# Load modules
module "database" {
  source      = "./modules/database"
  environment = var.environment
  project_name = var.project_name
}

module "elastic_search" {
  source      = "./modules/elastic_search"
  environment = var.environment
  project_name = var.project_name
}

module "backend" {
  source      = "./modules/backend"
  environment = var.environment
  project_name = var.project_name
  db_endpoint = module.database.db_endpoint
  db_name     = module.database.db_name
  es_endpoint = module.elastic_search.es_endpoint
}

module "frontend" {
  source      = "./modules/frontend"
  environment = var.environment
  project_name = var.project_name
  api_endpoint = module.backend.api_endpoint
}

# Outputs
output "frontend_url" {
  value = module.frontend.frontend_url
}

output "backend_url" {
  value = module.backend.api_endpoint
} 