import functools
from flask import jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.error_handlers import APIError

def admin_required(fn):
    """
    Decorator for endpoints that require admin privileges.
    Must be used together with jwt_required.
    """
    @functools.wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        # Get current user ID from JWT
        user_id = get_jwt_identity()
        
        try:
            # Access Supabase client from app context
            supabase = current_app.supabase
            
            # Query for the user and check admin status
            response = supabase.table('users').select('is_admin').eq('id', user_id).execute()
            
            if not response.data or not response.data[0].get('is_admin', False):
                raise APIError("Administrator privileges required", status_code=403)
            
            # If admin, proceed with the original function
            return fn(*args, **kwargs)
            
        except Exception as e:
            if isinstance(e, APIError):
                raise e
            else:
                raise APIError(f"Authorization error: {str(e)}", status_code=403)
    
    return wrapper

def get_current_user():
    """Get the current authenticated user's information."""
    user_id = get_jwt_identity()
    supabase = current_app.supabase
    
    try:
        response = supabase.table('users').select('*').eq('id', user_id).execute()
        if not response.data:
            return None
        return response.data[0]
    except Exception as e:
        current_app.logger.error(f"Error fetching current user: {str(e)}")
        return None 