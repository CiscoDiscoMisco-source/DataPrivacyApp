terraform {
  backend "s3" {
    bucket         = "data-privacy-app-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
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

# Root module
module "data_privacy_app" {
  source = "../../"
  
  environment  = "dev"
  project_name = "data-privacy-app"
  aws_region   = var.aws_region
}

# Outputs
output "frontend_url" {
  value = module.data_privacy_app.frontend_url
}

output "backend_url" {
  value = module.data_privacy_app.backend_url
} 