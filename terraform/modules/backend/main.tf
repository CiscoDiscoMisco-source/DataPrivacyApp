variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "db_endpoint" {
  description = "Database endpoint"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "es_endpoint" {
  description = "Elasticsearch endpoint"
  type        = string
}

# S3 bucket for application versions
resource "aws_s3_bucket" "app_versions" {
  bucket = "${var.project_name}-${var.environment}-app-versions"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-app-versions"
    Environment = var.environment
  }
}

# S3 bucket for user uploads
resource "aws_s3_bucket" "user_uploads" {
  bucket = "${var.project_name}-${var.environment}-user-uploads"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-user-uploads"
    Environment = var.environment
  }
}

# Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "app" {
  name        = "${var.project_name}-${var.environment}"
  description = "Data Privacy App Flask Backend"
}

# Elastic Beanstalk environment
resource "aws_elastic_beanstalk_environment" "env" {
  name                = "${var.project_name}-${var.environment}-env"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.5.0 running Python 3.9"
  
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ENVIRONMENT"
    value     = var.environment
  }
  
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_HOST"
    value     = var.db_endpoint
  }
  
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_NAME"
    value     = var.db_name
  }
  
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ES_ENDPOINT"
    value     = var.es_endpoint
  }
  
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "S3_BUCKET"
    value     = aws_s3_bucket.user_uploads.bucket
  }
  
  # Auto Scaling settings
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = var.environment == "prod" ? "2" : "1"
  }
  
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = var.environment == "prod" ? "4" : "2"
  }
  
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = var.environment == "prod" ? "LoadBalanced" : "SingleInstance"
  }
  
  # Instance settings
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = var.environment == "prod" ? "t3.small" : "t3.micro"
  }
  
  # Load balancer settings
  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/api/health"
  }
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-env"
    Environment = var.environment
  }
}

# IAM role for the backend service
resource "aws_iam_role" "backend_role" {
  name = "${var.project_name}-${var.environment}-backend-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-role"
    Environment = var.environment
  }
}

# IAM policy for the backend service
resource "aws_iam_policy" "backend_policy" {
  name        = "${var.project_name}-${var.environment}-backend-policy"
  description = "Policy for backend service"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          aws_s3_bucket.user_uploads.arn,
          "${aws_s3_bucket.user_uploads.arn}/*"
        ]
      },
      {
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ssm:*:*:parameter/${var.project_name}/${var.environment}/*"
      },
      {
        Action = [
          "es:ESHttpGet",
          "es:ESHttpPost",
          "es:ESHttpPut",
          "es:ESHttpDelete"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "backend_attach" {
  role       = aws_iam_role.backend_role.name
  policy_arn = aws_iam_policy.backend_policy.arn
}

# Create IAM instance profile
resource "aws_iam_instance_profile" "backend_profile" {
  name = "${var.project_name}-${var.environment}-backend-profile"
  role = aws_iam_role.backend_role.name
}

# Store backend API endpoint in SSM Parameter Store
resource "aws_ssm_parameter" "api_endpoint" {
  name        = "/${var.project_name}/${var.environment}/api/endpoint"
  description = "Backend API endpoint"
  type        = "String"
  value       = aws_elastic_beanstalk_environment.env.endpoint_url
  
  tags = {
    Environment = var.environment
  }
}

# Output backend API endpoint
output "api_endpoint" {
  value = aws_elastic_beanstalk_environment.env.endpoint_url
} 