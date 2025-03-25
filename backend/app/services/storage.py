from supabase import Client
import os
from flask import current_app
import io
from app.utils.supabase_client import get_supabase_client

class SupabaseStorageService:
    """Service for interacting with Supabase Storage."""
    
    def __init__(self):
        """Initialize Supabase client and storage."""
        self.supabase = get_supabase_client()
        self.bucket = 'uploads'  # Default bucket name
        
        # Ensure the bucket exists
        try:
            # Check if bucket exists by trying to get info
            self.supabase.storage.get_bucket(self.bucket)
        except:
            # Create the bucket if it doesn't exist
            try:
                self.supabase.storage.create_bucket(self.bucket, {'public': False})
                current_app.logger.info(f"Created Supabase Storage bucket: {self.bucket}")
            except Exception as e:
                current_app.logger.error(f"Failed to create bucket: {e}")
    
    def upload_file(self, file_data, file_name, content_type=None, acl='private'):
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_data: The file data to upload
            file_name: The name to give the file in storage
            content_type: The content type of the file (ignored, Supabase detects automatically)
            acl: The access control (ignored, set in bucket policy)
            
        Returns:
            The URL of the uploaded file
        """
        try:
            # Convert file_data to bytes if it's not already
            if not isinstance(file_data, bytes):
                if hasattr(file_data, 'read'):
                    file_data = file_data.read()
                else:
                    file_data = bytes(file_data)
            
            # Upload to Supabase
            response = self.supabase.storage.from_(self.bucket).upload(
                file_name,
                file_data,
                {'upsert': True}
            )
            
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase upload error: {response.error}")
                raise Exception(f"Failed to upload file: {response.error}")
            
            # Get public URL
            file_url = self.supabase.storage.from_(self.bucket).get_public_url(file_name)
            return file_url
        
        except Exception as e:
            current_app.logger.error(f"Supabase Storage upload error: {e}")
            raise
    
    def delete_file(self, file_name):
        """
        Delete a file from Supabase Storage.
        
        Args:
            file_name: The name of the file to delete
            
        Returns:
            True if the file was deleted, False otherwise
        """
        try:
            response = self.supabase.storage.from_(self.bucket).remove([file_name])
            
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase delete error: {response.error}")
                return False
                
            return True
        except Exception as e:
            current_app.logger.error(f"Supabase Storage delete error: {e}")
            return False
    
    def get_file_url(self, file_name, expiration=3600):
        """
        Generate a URL for a file that expires after a certain time.
        
        Args:
            file_name: The name of the file
            expiration: The number of seconds until the URL expires
            
        Returns:
            The signed URL
        """
        try:
            response = self.supabase.storage.from_(self.bucket).create_signed_url(
                file_name,
                expiration
            )
            
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase signed URL error: {response.error}")
                return None
                
            return response.get('signedURL')
        except Exception as e:
            current_app.logger.error(f"Supabase Storage signed URL error: {e}")
            return None 