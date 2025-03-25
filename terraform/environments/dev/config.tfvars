# Development environment configuration

# AWS Configuration
aws_region = "us-east-1"
availability_zones = ["us-east-1a", "us-east-1b"]

# VPC and Network
vpc_cidr = "10.0.0.0/16"
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]

# Database
db_instance_class = "db.t3.small"
db_storage_gb = 20
db_name = "dataprivacy_dev"
db_username = "dbadmin"
db_multi_az = false
db_backup_retention_days = 7

# Elastic Beanstalk
eb_instance_type = "t3.small"
eb_min_instances = 1
eb_max_instances = 2

# Frontend
frontend_domain = "dev.dataprivacyapp.com"
cloudfront_price_class = "PriceClass_100" # Use only North America and Europe

# Elasticsearch
es_instance_type = "t3.small.elasticsearch"
es_instance_count = 1
es_volume_size_gb = 10

# Application
app_name = "data-privacy-app"
app_environment = "dev"
app_version = "0.1.0" 