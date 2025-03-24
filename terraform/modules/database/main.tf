variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

# Create a security group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Allow inbound traffic to RDS instance"

  ingress {
    description = "Allow PostgreSQL connection"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # In production, restrict this to VPC CIDR or specific IPs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

# Create RDS instance
resource "aws_db_instance" "postgres" {
  identifier           = "${var.project_name}-${var.environment}-db"
  allocated_storage    = var.environment == "prod" ? 50 : 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14.5"
  instance_class       = var.environment == "prod" ? "db.t3.small" : "db.t3.micro"
  username             = "postgres"
  password             = random_password.db_password.result
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = var.environment != "prod"
  publicly_accessible  = var.environment != "prod"
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  backup_retention_period = var.environment == "prod" ? 7 : 1
  backup_window          = "03:00-04:00"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-db"
    Environment = var.environment
  }
}

# Generate a random password for the database
resource "random_password" "db_password" {
  length  = 16
  special = false
}

# Store database credentials in SSM Parameter Store
resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.project_name}/${var.environment}/database/password"
  description = "PostgreSQL database password"
  type        = "SecureString"
  value       = random_password.db_password.result
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_ssm_parameter" "db_username" {
  name        = "/${var.project_name}/${var.environment}/database/username"
  description = "PostgreSQL database username"
  type        = "String"
  value       = "postgres"
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_ssm_parameter" "db_name" {
  name        = "/${var.project_name}/${var.environment}/database/name"
  description = "PostgreSQL database name"
  type        = "String"
  value       = aws_db_instance.postgres.name
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_ssm_parameter" "db_endpoint" {
  name        = "/${var.project_name}/${var.environment}/database/endpoint"
  description = "PostgreSQL database endpoint"
  type        = "String"
  value       = aws_db_instance.postgres.endpoint
  
  tags = {
    Environment = var.environment
  }
}

# Output the database endpoint, name, username, and password
output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_name" {
  value = aws_db_instance.postgres.name
}

output "db_username" {
  value = aws_ssm_parameter.db_username.value
}

output "db_password" {
  value     = aws_ssm_parameter.db_password.value
  sensitive = true
} 