import jwt
from flask import request, jsonify
from functools import wraps
from os import environ

def authenticate_token():
    """
    Middleware to authenticate JWT tokens.
    Returns the decoded token or None if authentication fails.
    """
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] if auth_header and auth_header.startswith('Bearer ') else None
    
    if not token:
        return None
    
    try:
        secret = environ.get('JWT_SECRET_KEY', 'default_jwt_secret_for_development')
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        return decoded
    except jwt.PyJWTError as error:
        print(f'JWT verification error: {error}')
        return None

def token_required(f):
    """
    Decorator for routes that require token authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token_data = authenticate_token()
        
        if not token_data:
            return jsonify({'message': 'Authentication is required!'}), 401
            
        # Add user info to request context
        kwargs['user_id'] = token_data.get('user_id')
        return f(*args, **kwargs)
        
    return decorated 