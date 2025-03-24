variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "api_endpoint" {
  description = "Backend API endpoint"
  type        = string
}

# S3 bucket for frontend hosting
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-${var.environment}-frontend"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-frontend"
    Environment = var.environment
  }
}

# S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "s3:GetObject"
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
      }
    ]
  })
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "${var.project_name}-${var.environment}-oai"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "frontend_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.project_name}-${var.environment}-distribution"
  price_class         = var.environment == "prod" ? "PriceClass_All" : "PriceClass_100"
  
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"
    
    forwarded_values {
      query_string = true
      
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  # Cache behavior for API calls
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"
    
    forwarded_values {
      query_string = true
      
      cookies {
        forward = "all"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }
  
  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern     = "/_next/static/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"
    
    forwarded_values {
      query_string = false
      
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000  # 1 year
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  # Handle SPA routing by redirecting to index.html for 404 errors
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-distribution"
    Environment = var.environment
  }
}

# Store frontend URL in SSM Parameter Store
resource "aws_ssm_parameter" "frontend_url" {
  name        = "/${var.project_name}/${var.environment}/frontend/url"
  description = "Frontend URL"
  type        = "String"
  value       = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
  
  tags = {
    Environment = var.environment
  }
}

# Store API endpoint in SSM Parameter Store for frontend to use
resource "aws_ssm_parameter" "frontend_api_endpoint" {
  name        = "/${var.project_name}/${var.environment}/frontend/api_endpoint"
  description = "Backend API endpoint for frontend"
  type        = "String"
  value       = var.api_endpoint
  
  tags = {
    Environment = var.environment
  }
}

# Output frontend URL
output "frontend_url" {
  value = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
} 