from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from app.models.user import User
from app.models.token import RevokedToken
from app.utils.error_handlers import (
    ValidationError, AuthenticationError, NotFoundError
)
import datetime
import uuid
import logging

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            raise ValidationError(
                f'The following fields are required: {", ".join(missing_fields)}'
            )
        
        # Validate email format
        if '@' not in data['email'] or '.' not in data['email']:
            raise ValidationError('Please provide a valid email address')
        
        # Check password strength
        if len(data['password']) < 8:
            raise ValidationError('Password must be at least 8 characters long')
        
        # Check if user already exists
        existing_user = User.get_by_email(current_app.supabase, data['email'])
        if existing_user:
            raise ValidationError('A user with this email already exists')
        
        # Create new user
        user = User.create(
            supabase=current_app.supabase,
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        # Create tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        logger.info(f"New user registered: {user['email']}")
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user with Supabase authentication."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            raise ValidationError('Email and password are required')
        
        # First try to login with Supabase directly
        try:
            supabase = current_app.supabase
            
            # Use Supabase auth to sign in
            auth_response = supabase.auth.sign_in_with_password({
                "email": data['email'],
                "password": data['password']
            })
            
            if not auth_response or 'error' in auth_response:
                error_msg = auth_response.get('error', {}).get('message', 'Invalid credentials') if auth_response else 'Invalid credentials'
                logger.error(f"Supabase auth error: {error_msg}")
                raise AuthenticationError('Invalid email or password')
            
            # Get user data from auth response
            supabase_user = auth_response.get('data', {}).get('user', {})
            supabase_session = auth_response.get('data', {}).get('session', {})
            
            if not supabase_user or not supabase_user.get('id'):
                logger.error(f"Missing user data in Supabase auth response")
                raise AuthenticationError('Invalid authentication response')
            
            # Get full user profile from database
            user = User.get_by_email(current_app.supabase, data['email'])
            
            # If user doesn't exist in our database yet, create the record
            if not user:
                user = User.create(
                    supabase=current_app.supabase,
                    email=data['email'],
                    password=data['password'],  # This will be hashed
                    first_name=supabase_user.get('user_metadata', {}).get('first_name', ''),
                    last_name=supabase_user.get('user_metadata', {}).get('last_name', '')
                )
            
            # Use Supabase session tokens
            access_token = supabase_session.get('access_token')
            refresh_token = supabase_session.get('refresh_token')
            
            # Build response with session data
            response = {
                'message': 'Login successful',
                'user': user,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'provider': 'supabase'
            }
            
            # Add token expiration info
            expires_at = datetime.datetime.fromtimestamp(supabase_session.get('expires_at', 0))
            response['token_expires_at'] = expires_at.isoformat()
            
            logger.info(f"User logged in via Supabase: {user['email']}")
            
            return jsonify(response), 200
            
        except Exception as supabase_error:
            # Log the error but fall back to JWT authentication
            logger.error(f"Supabase auth failed, falling back to JWT: {str(supabase_error)}", exc_info=True)
            
            # Find user in our database
            user = User.get_by_email(current_app.supabase, data['email'])
            if not user or not User.verify_password(data['password'], user['password_hash']):
                raise AuthenticationError('Invalid email or password')
            
            # Create our own tokens
            access_token = create_access_token(identity=user['id'])
            refresh_token = create_refresh_token(identity=user['id'])
            
            # Build response
            response = {
                'message': 'Login successful (via JWT fallback)',
                'user': user,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'provider': 'jwt'
            }
            
            # Add token expiration info
            token_expires = datetime.datetime.now() + current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', datetime.timedelta(hours=1))
            response['token_expires_at'] = token_expires.isoformat()
            
            logger.info(f"User logged in via JWT fallback: {user['email']}")
            
            return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    try:
        current_user_id = get_jwt_identity()
        # Add additional claims if needed
        additional_claims = {
            'token_type': 'access',
            'refresh_id': str(uuid.uuid4())
        }
        access_token = create_access_token(
            identity=current_user_id,
            additional_claims=additional_claims
        )
        
        return jsonify({
            'access_token': access_token,
            'token_expires_at': (datetime.datetime.now() + current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', datetime.timedelta(hours=1))).isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get current user info."""
    try:
        current_user_id = get_jwt_identity()
        
        # Try to get user from Supabase first by using the token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
            try:
                # Try to get user with this token directly from Supabase
                verify_result = current_app.supabase.auth.get_user(token)
                if verify_result and verify_result.data and verify_result.data.user:
                    supabase_user_id = verify_result.data.user.id
                    
                    # If the token is valid, use that user ID instead of JWT identity
                    user = User.get_by_id(current_app.supabase, supabase_user_id)
                    if user:
                        return jsonify({'user': user}), 200
                    else:
                        # User exists in Supabase but not in our database
                        logger.warning(f"User {supabase_user_id} exists in Supabase but not in our database")
            except Exception as e:
                logger.warning(f"Error verifying Supabase token: {e}")
                # Fall back to JWT-based identity
        
        # If Supabase verification failed or we didn't get a user, use JWT identity
        user = User.get_by_id(current_app.supabase, current_user_id)
        
        if not user:
            raise NotFoundError('The user no longer exists')
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        logger.error(f"Get user info error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout a user by revoking their tokens."""
    try:
        jti = get_jwt()['jti']
        expires_at = datetime.datetime.fromtimestamp(get_jwt()['exp'])
        user_id = get_jwt_identity()
        
        # Add token to revoked tokens table
        RevokedToken.add(
            supabase=current_app.supabase,
            jti=jti,
            expires_at=expires_at,
            user_id=user_id
        )
        
        logger.info(f"User logged out: {user_id}")
        
        return jsonify({
            'message': 'Successfully logged out'
        }), 200
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/tokens', methods=['GET'])
@jwt_required()
def get_tokens():
    """Get the current user's active tokens."""
    try:
        current_user_id = get_jwt_identity()
        
        # Get user's active tokens from the database
        active_tokens = RevokedToken.get_user_tokens(
            supabase=current_app.supabase,
            user_id=current_user_id
        )
        
        return jsonify({
            'tokens': [
                {
                    'id': token['id'],
                    'created_at': token['revoked_at'],
                    'expires_at': token['expires_at'],
                    'description': 'Active session token'
                }
                for token in active_tokens
            ]
        }), 200
        
    except Exception as e:
        logger.error(f"Get tokens error: {str(e)}", exc_info=True)
        raise

@auth_bp.route('/tokens/<string:token_id>', methods=['DELETE'])
@jwt_required()
def delete_token(token_id):
    """Delete/revoke a token."""
    try:
        # Get token details
        token = RevokedToken.get_user_tokens(
            supabase=current_app.supabase,
            user_id=get_jwt_identity()
        )
        
        if not token:
            raise NotFoundError('Token not found')
        
        # Ensure the token belongs to the current user
        if token['user_id'] != get_jwt_identity():
            raise AuthenticationError('Not authorized to revoke this token')
        
        # Delete the token
        RevokedToken.delete_token(
            supabase=current_app.supabase,
            token_id=token_id
        )
        
        logger.info(f"Token revoked: {token_id}")
        
        return jsonify({
            'message': f'Token {token_id} has been revoked'
        }), 200
        
    except Exception as e:
        logger.error(f"Delete token error: {str(e)}", exc_info=True)
        raise 