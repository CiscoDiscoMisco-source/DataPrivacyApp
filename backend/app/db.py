from supabase import create_client, Client
from flask import current_app
import logging
import time
import requests
from typing import Optional

logger = logging.getLogger(__name__)

def check_supabase_connection(client: Client, max_retries: int = 3, retry_delay: int = 2) -> bool:
    """
    Check if the Supabase connection is working by executing a simple query.
    
    Args:
        client: The Supabase client to test
        max_retries: Maximum number of retry attempts
        retry_delay: Delay between retries in seconds
    
    Returns:
        bool: True if connection is working, False otherwise
    """
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Testing Supabase connection (Attempt {attempt}/{max_retries})...")
            # Execute a simple query to verify connection
            response = client.table("companies").select("count").limit(1).execute()
            logger.info(f"Supabase connection test successful")
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed (Attempt {attempt}/{max_retries}): {e}")
            if attempt < max_retries:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
    
    return False

def verify_supabase_url(url: str, timeout: int = 5) -> bool:
    """
    Verify if the Supabase URL is reachable.
    
    Args:
        url: The Supabase URL to check
        timeout: Request timeout in seconds
    
    Returns:
        bool: True if URL is reachable, False otherwise
    """
    try:
        response = requests.head(url, timeout=timeout)
        logger.info(f"Supabase URL check: Status {response.status_code}")
        # For Supabase, even a 404 response means the URL is valid
        return True
    except requests.RequestException as e:
        logger.error(f"Supabase URL is not reachable: {e}")
        return False

def get_supabase() -> Client:
    """Get the Supabase client from the current app context."""
    if not hasattr(current_app, 'supabase'):
        logger.error("Supabase client not initialized!")
        raise RuntimeError("Supabase client not initialized")
    
    # Return the initialized client
    return current_app.supabase

def get_supabase_admin() -> Client:
    """Get the Supabase admin client from the current app context."""
    if not hasattr(current_app, 'supabase_admin'):
        logger.error("Supabase admin client not initialized!")
        raise RuntimeError("Supabase admin client not initialized")
    
    # Return the initialized client
    return current_app.supabase_admin

def init_supabase_client(url: str, key: str, is_admin: bool = False, max_retries: int = 3) -> Optional[Client]:
    """
    Initialize a Supabase client with connection validation and retry logic.
    
    Args:
        url: Supabase URL
        key: Supabase API key
        is_admin: Whether this is an admin client
        max_retries: Maximum number of connection attempts
    
    Returns:
        Client: Initialized Supabase client or None if connection fails
    """
    client_type = "admin" if is_admin else "regular"
    
    # First, verify the URL is reachable
    if not verify_supabase_url(url):
        logger.error(f"Cannot initialize {client_type} Supabase client: URL not reachable")
        return None
    
    # Create the client
    try:
        client = create_client(url, key)
        
        # Verify connection works
        if check_supabase_connection(client, max_retries=max_retries):
            logger.info(f"Successfully initialized {client_type} Supabase client")
            return client
        else:
            logger.error(f"Failed to validate {client_type} Supabase client connection after {max_retries} attempts")
            return None
    except Exception as e:
        logger.error(f"Error initializing {client_type} Supabase client: {e}")
        return None 