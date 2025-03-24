import boto3
import botocore
import os
from app import db
from flask import current_app

class S3Service:
    """Service for interacting with AWS S3."""
    
    def __init__(self):
        """Initialize S3 client."""
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=current_app.config.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=current_app.config.get('AWS_SECRET_ACCESS_KEY'),
            region_name=current_app.config.get('AWS_REGION')
        )
        self.bucket = current_app.config.get('S3_BUCKET')
    
    def upload_file(self, file_data, file_name, content_type=None, acl='private'):
        """
        Upload a file to S3.
        
        Args:
            file_data: The file data to upload
            file_name: The name to give the file in S3
            content_type: The content type of the file
            acl: The access control list for the file
            
        Returns:
            The URL of the uploaded file
        """
        try:
            extra_args = {'ACL': acl}
            if content_type:
                extra_args['ContentType'] = content_type
                
            self.s3.put_object(
                Bucket=self.bucket,
                Key=file_name,
                Body=file_data,
                **extra_args
            )
            
            # Return the URL of the uploaded file
            return f"https://{self.bucket}.s3.{current_app.config.get('AWS_REGION')}.amazonaws.com/{file_name}"
        except botocore.exceptions.ClientError as e:
            current_app.logger.error(f"S3 upload error: {e}")
            raise
    
    def delete_file(self, file_name):
        """
        Delete a file from S3.
        
        Args:
            file_name: The name of the file to delete
            
        Returns:
            True if the file was deleted, False otherwise
        """
        try:
            self.s3.delete_object(
                Bucket=self.bucket,
                Key=file_name
            )
            return True
        except botocore.exceptions.ClientError as e:
            current_app.logger.error(f"S3 delete error: {e}")
            return False
    
    def get_file_url(self, file_name, expiration=3600):
        """
        Generate a presigned URL for a file.
        
        Args:
            file_name: The name of the file
            expiration: The number of seconds until the URL expires
            
        Returns:
            The presigned URL
        """
        try:
            response = self.s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': file_name},
                ExpiresIn=expiration
            )
            return response
        except botocore.exceptions.ClientError as e:
            current_app.logger.error(f"S3 URL generation error: {e}")
            return None 