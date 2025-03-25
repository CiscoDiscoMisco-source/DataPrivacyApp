"""
Supabase client utility for accessing Supabase services.
Provides a global client instance for database access, storage, and other Supabase services.
"""
from supabase import create_client, Client
import os
from flask import current_app
import functools
import time

# Global client cache
_client_instance = None

def get_supabase_client():
    """
    Get the Supabase client instance, using Flask app config if available,
    otherwise using environment variables directly.
    
    Returns:
        Client: A configured Supabase client
    """
    global _client_instance
    
    # Return cached instance if available
    if _client_instance is not None:
        return _client_instance
    
    try:
        # Try to get config from Flask app context
        url = current_app.config.get('SUPABASE_URL')
        key = current_app.config.get('SUPABASE_KEY')
    except RuntimeError:
        # If not in app context, use environment variables directly
        url = os.environ.get('SUPABASE_URL')
        key = os.environ.get('SUPABASE_KEY')
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    
    _client_instance = create_client(url, key)
    return _client_instance

# Helper for retrying operations
def with_retry(max_retries=3, delay=1):
    """
    Decorator to retry a function on failure.
    
    Args:
        max_retries (int): Maximum number of retries
        delay (int): Delay between retries in seconds
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator

@with_retry(max_retries=3)
def test_connection():
    """Test the Supabase connection."""
    client = get_supabase_client()
    try:
        # Try a simple query to test the connection
        client.table('companies').select('count').limit(1).execute()
        return True
    except Exception as e:
        print(f"Connection test failed: {str(e)}")
        return False

if __name__ == "__main__":
    # When run directly, print connection test results
    connection_status = test_connection()
    print("\nSupabase Connection Test Results:")
    print("--------------------------------")
    
    # Supabase status
    print(f"Supabase: {'✅ Connected' if connection_status else '❌ Failed'}")
    print(f"Message: {'Connection successful' if connection_status else 'Connection failed'}") 