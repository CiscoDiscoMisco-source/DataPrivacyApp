variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

# Create Elasticsearch domain
resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${var.project_name}-${var.environment}-es"
  elasticsearch_version = "7.10"

  cluster_config {
    instance_type = var.environment == "prod" ? "t3.small.elasticsearch" : "t3.small.elasticsearch"
    instance_count = var.environment == "prod" ? 2 : 1
    zone_awareness_enabled = var.environment == "prod" ? true : false
    
    zone_awareness_config {
      availability_zone_count = var.environment == "prod" ? 2 : 1
    }
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.environment == "prod" ? 20 : 10
    volume_type = "gp2"
  }

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  # Access policy
  access_policies = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "es:*",
      "Resource": "arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/${var.project_name}-${var.environment}-es/*"
    }
  ]
}
CONFIG

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-es"
    Environment = var.environment
  }
}

# Store Elasticsearch endpoint in SSM Parameter Store
resource "aws_ssm_parameter" "es_endpoint" {
  name        = "/${var.project_name}/${var.environment}/elasticsearch/endpoint"
  description = "Elasticsearch endpoint"
  type        = "String"
  value       = aws_elasticsearch_domain.es.endpoint
  
  tags = {
    Environment = var.environment
  }
}

# Current AWS region and account ID
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# Output Elasticsearch endpoint
output "es_endpoint" {
  value = aws_elasticsearch_domain.es.endpoint
} 