# Data Privacy App Terraform Configuration

This directory contains Terraform configuration files to deploy the Data Privacy App infrastructure on AWS.

## Architecture

The Terraform configuration sets up the following components:

- **Database**: PostgreSQL RDS instance for storing application data
- **Elasticsearch**: AWS Elasticsearch service for search functionality
- **Backend**: Flask application deployed on Elastic Beanstalk
- **Frontend**: Next.js application hosted on S3 and distributed via CloudFront
- **Storage**: S3 buckets for user uploads and application versions

## Directory Structure

```
terraform/
├── main.tf                 # Main Terraform configuration
├── modules/                # Reusable modules
│   ├── database/           # RDS PostgreSQL module
│   ├── elastic_search/     # Elasticsearch module
│   ├── backend/            # Flask backend module (Elastic Beanstalk)
│   └── frontend/           # Next.js frontend module (S3 + CloudFront)
└── environments/           # Environment-specific configurations
    ├── dev/                # Development environment
    └── prod/               # Production environment
```

## Prerequisites

Before deploying the infrastructure, you need to:

1. Create an S3 bucket for Terraform state:
   ```bash
   aws s3 mb s3://data-privacy-app-terraform-state
   ```

2. Create a DynamoDB table for state locking:
   ```bash
   aws dynamodb create-table \
     --table-name terraform-state-lock \
     --attribute-definitions AttributeName=LockID,AttributeType=S \
     --key-schema AttributeName=LockID,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

3. Install Terraform CLI:
   ```bash
   # Download the latest version from https://www.terraform.io/downloads.html
   ```

## Deployment

### Development Environment

To deploy the development environment:

```bash
cd terraform/environments/dev
terraform init
terraform plan
terraform apply
```

### Production Environment

To deploy the production environment:

```bash
cd terraform/environments/prod
terraform init
terraform plan
terraform apply
```

## Outputs

After deployment, Terraform will output:

- Frontend URL (CloudFront distribution domain)
- Backend URL (Elastic Beanstalk environment endpoint)

## Configuration

The application configuration is stored in AWS SSM Parameter Store:

- Database credentials
- Elasticsearch endpoint
- API endpoint
- Frontend URL

The backend application retrieves these parameters at runtime.

## Cleanup

To destroy the infrastructure:

```bash
cd terraform/environments/dev  # or prod
terraform destroy
```

**WARNING**: This will delete all resources created by Terraform, including the database and stored data. 