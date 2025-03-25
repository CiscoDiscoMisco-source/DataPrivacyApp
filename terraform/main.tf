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

# Define all resources based on terraform variables
# Environment specific configurations will be loaded from the environments directory

# Variables for environment selection
variable "environment" {
  description = "Deployment environment (dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

# Load environment-specific configuration
locals {
  env_config = "${path.module}/environments/${var.environment}/config.tfvars"
}

# VPC and Network
module "network" {
  source      = "./modules/network"
  environment = var.environment
  vpc_cidr    = "10.0.0.0/16"
}

# Database (RDS)
module "database" {
  source      = "./modules/database"
  environment = var.environment
  vpc_id      = module.network.vpc_id
  subnet_ids  = module.network.private_subnet_ids
  depends_on  = [module.network]
}

# Backend - Elastic Beanstalk
module "backend" {
  source       = "./modules/backend"
  environment  = var.environment
  vpc_id       = module.network.vpc_id
  subnet_ids   = module.network.private_subnet_ids
  database_url = module.database.database_url
  depends_on   = [module.database]
}

# Frontend - S3 and CloudFront
module "frontend" {
  source      = "./modules/frontend"
  environment = var.environment
  domain_name = var.environment == "prod" ? "dataprivacyapp.com" : "${var.environment}.dataprivacyapp.com"
}

# API Gateway
module "api_gateway" {
  source      = "./modules/api_gateway"
  environment = var.environment
  backend_url = module.backend.backend_url
  depends_on  = [module.backend]
}

# Elasticsearch for search
module "elasticsearch" {
  source      = "./modules/elasticsearch"
  environment = var.environment
  vpc_id      = module.network.vpc_id
  subnet_ids  = module.network.private_subnet_ids
  depends_on  = [module.network]
}

# Output the endpoints and important values
output "frontend_url" {
  value = module.frontend.frontend_url
}

output "api_url" {
  value = module.api_gateway.api_url
}

output "elasticsearch_url" {
  value = module.elasticsearch.elasticsearch_url
  sensitive = true
}

output "database_connection" {
  value = module.database.database_url
  sensitive = true
} 