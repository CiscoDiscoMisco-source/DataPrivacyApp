from supabase import Client
import os
from flask import current_app
import io
from app.utils.supabase_client import get_supabase_client, with_retry
import time
import functools
from werkzeug.utils import secure_filename

class SupabaseStorageService:
    """Service for interacting with Supabase Storage."""
    
    _instance = None
    
    @classmethod
    def get_instance(cls):
        """Get singleton instance of the storage service."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def __init__(self):
        """Initialize Supabase client and storage."""
        self.supabase = get_supabase_client()
        self.bucket = os.environ.get('SUPABASE_STORAGE_BUCKET', 'uploads')
        self._url_cache = {}  # Cache for signed URLs
        
        # Ensure the bucket exists
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Make sure the storage bucket exists, creating it if needed."""
        try:
            # Check if bucket exists by trying to get info
            self.supabase.storage.get_bucket(self.bucket)
            current_app.logger.debug(f"Using existing Supabase Storage bucket: {self.bucket}")
        except Exception as e:
            current_app.logger.warning(f"Error checking bucket: {str(e)}")
            # Create the bucket if it doesn't exist
            try:
                self.supabase.storage.create_bucket(self.bucket, {'public': False})
                current_app.logger.info(f"Created Supabase Storage bucket: {self.bucket}")
            except Exception as e:
                current_app.logger.error(f"Failed to create bucket: {str(e)}")
                raise
    
    @with_retry(max_retries=2)
    def upload_file(self, file_data, file_path=None, content_type=None, acl='private'):
        """
        Upload a file to Supabase Storage.
        
        Args:
            file_data: The file data to upload (bytes, file-like object, etc.)
            file_path: Path/name for the file in storage (if None, a unique name is generated)
            content_type: The content type of the file (ignored, Supabase detects automatically)
            acl: Access control level (private, public)
            
        Returns:
            dict: Information about the uploaded file including URL
        """
        try:
            # Convert file_data to bytes if it's not already
            if not isinstance(file_data, bytes):
                if hasattr(file_data, 'read'):
                    file_data = file_data.read()
                else:
                    file_data = bytes(file_data)
            
            # Generate file path if not provided
            if not file_path:
                timestamp = int(time.time())
                file_path = f"upload_{timestamp}_{secure_filename(str(hash(file_data))[:8])}"
            
            # Make sure path is sanitized
            file_path = secure_filename(file_path)
            
            # Upload to Supabase
            response = self.supabase.storage.from_(self.bucket).upload(
                file_path,
                file_data,
                {'upsert': True}
            )
            
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase upload error: {response.error}")
                raise Exception(f"Failed to upload file: {response.error}")
            
            # Get URLs for the file
            file_info = {
                'name': file_path,
                'size': len(file_data),
                'url': self.get_file_url(file_path),
                'public_url': self.get_public_url(file_path) if acl == 'public' else None
            }
            
            return file_info
        
        except Exception as e:
            current_app.logger.error(f"Supabase Storage upload error: {e}")
            raise
    
    @with_retry(max_retries=2)
    def delete_file(self, file_name):
        """
        Delete a file from Supabase Storage.
        
        Args:
            file_name: The name of the file to delete
            
        Returns:
            bool: True if the file was deleted, False otherwise
        """
        try:
            response = self.supabase.storage.from_(self.bucket).remove([file_name])
            
            # Clear cache entry if it exists
            if file_name in self._url_cache:
                del self._url_cache[file_name]
                
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase delete error: {response.error}")
                return False
                
            return True
        except Exception as e:
            current_app.logger.error(f"Supabase Storage delete error: {e}")
            return False
    
    def get_public_url(self, file_name):
        """
        Get a public URL for a file.
        
        Args:
            file_name: The name of the file
            
        Returns:
            str: The public URL
        """
        try:
            return self.supabase.storage.from_(self.bucket).get_public_url(file_name)
        except Exception as e:
            current_app.logger.error(f"Supabase Storage public URL error: {e}")
            return None
    
    def get_file_url(self, file_name, expiration=3600):
        """
        Generate a URL for a file that expires after a certain time.
        Uses caching to avoid generating new URLs unnecessarily.
        
        Args:
            file_name: The name of the file
            expiration: The number of seconds until the URL expires
            
        Returns:
            str: The signed URL
        """
        # Check cache first
        cache_key = f"{file_name}:{expiration}"
        cache_entry = self._url_cache.get(cache_key)
        
        # If URL is in cache and not expired, return it
        current_time = time.time()
        if cache_entry and cache_entry['expires_at'] > current_time:
            return cache_entry['url']
        
        # Otherwise generate a new URL
        try:
            response = self.supabase.storage.from_(self.bucket).create_signed_url(
                file_name,
                expiration
            )
            
            if hasattr(response, 'error') and response.error:
                current_app.logger.error(f"Supabase signed URL error: {response.error}")
                return None
            
            signed_url = response.get('signedURL')
            if signed_url:
                # Cache the URL
                self._url_cache[cache_key] = {
                    'url': signed_url,
                    'expires_at': current_time + expiration - 60  # Buffer of 60 seconds
                }
                
            return signed_url
        except Exception as e:
            current_app.logger.error(f"Supabase Storage signed URL error: {e}")
            return None 