#!/bin/bash

# Data Privacy App Terraform Deployment Script

set -e

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required. Please install it first."
    exit 1
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is required. Please install it first."
    exit 1
fi

# Verify AWS credentials are configured
aws sts get-caller-identity > /dev/null || {
    echo "Error: AWS credentials not configured. Please run 'aws configure'."
    exit 1
}

# Default environment
ENV="dev"

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -e|--environment)
            ENV="$2"
            shift
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [-e|--environment <dev|prod>] [--init] [--destroy]"
            echo ""
            echo "Options:"
            echo "  -e, --environment <env>  Specify environment (dev or prod). Default: dev"
            echo "  --init                   Run terraform init only"
            echo "  --destroy                Destroy infrastructure instead of creating/updating"
            echo "  -h, --help               Show this help message"
            exit 0
            ;;
        --init)
            INIT_ONLY=true
            shift
            ;;
        --destroy)
            DESTROY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
    echo "Error: Environment must be 'dev' or 'prod'"
    exit 1
fi

# Check if Terraform state bucket exists, create if not
aws s3 ls s3://data-privacy-app-terraform-state &> /dev/null || {
    echo "Creating S3 bucket for Terraform state..."
    aws s3 mb s3://data-privacy-app-terraform-state
    aws s3api put-bucket-versioning --bucket data-privacy-app-terraform-state --versioning-configuration Status=Enabled
}

# Check if DynamoDB table exists, create if not
aws dynamodb describe-table --table-name terraform-state-lock &> /dev/null || {
    echo "Creating DynamoDB table for state locking..."
    aws dynamodb create-table \
        --table-name terraform-state-lock \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST
}

# Change to environment directory
cd "$(dirname "$0")/environments/$ENV"

echo "Starting Terraform deployment for $ENV environment..."

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Exit if only initialization was requested
if [[ "$INIT_ONLY" == true ]]; then
    echo "Terraform initialization completed."
    exit 0
fi

# Destroy or apply
if [[ "$DESTROY" == true ]]; then
    echo "WARNING: This will destroy all infrastructure in the $ENV environment."
    read -p "Are you sure you want to continue? (y/N): " confirm
    
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        echo "Destroying infrastructure..."
        terraform destroy -auto-approve
        echo "Infrastructure in $ENV environment has been destroyed."
    else
        echo "Destroy operation cancelled."
    fi
else
    # Plan and apply
    echo "Planning changes..."
    terraform plan -out=tfplan
    
    echo "Applying changes..."
    terraform apply tfplan
    
    # Display outputs
    echo "Deployment completed. Outputs:"
    terraform output -json | jq
fi

echo "Done!" 