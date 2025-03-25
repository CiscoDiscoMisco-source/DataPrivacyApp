# Production environment configuration

# AWS Configuration
aws_region = "us-east-1"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# VPC and Network
vpc_cidr = "10.0.0.0/16"
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
public_subnet_cidrs = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]

# Database
db_instance_class = "db.t3.medium"
db_storage_gb = 50
db_name = "dataprivacy_prod"
db_username = "dbadmin"
db_multi_az = true
db_backup_retention_days = 30

# Elastic Beanstalk
eb_instance_type = "t3.medium"
eb_min_instances = 2
eb_max_instances = 6

# Frontend
frontend_domain = "dataprivacyapp.com"
cloudfront_price_class = "PriceClass_200" # Use North America, Europe, Asia

# Elasticsearch
es_instance_type = "m5.large.elasticsearch"
es_instance_count = 2
es_volume_size_gb = 20

# Application
app_name = "data-privacy-app"
app_environment = "prod"
app_version = "1.0.0" 