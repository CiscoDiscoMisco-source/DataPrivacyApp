from supabase import create_client, Client
from flask import current_app
import logging

logger = logging.getLogger(__name__)

def get_supabase() -> Client:
    """Get the Supabase client from the current app context."""
    if not hasattr(current_app, 'supabase'):
        logger.error("Supabase client not initialized!")
        raise RuntimeError("Supabase client not initialized")
    return current_app.supabase

def get_supabase_admin() -> Client:
    """Get the Supabase admin client from the current app context."""
    if not hasattr(current_app, 'supabase_admin'):
        logger.error("Supabase admin client not initialized!")
        raise RuntimeError("Supabase admin client not initialized")
    return current_app.supabase_admin 