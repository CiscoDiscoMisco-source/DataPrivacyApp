from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from app import db
from app.models.user import User
import datetime
import uuid

auth_bp = Blueprint('auth', __name__)

# Store for revoked tokens (in production this should be moved to Redis or database)
revoked_tokens = set()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'error': 'Missing fields',
            'message': f'The following fields are required: {", ".join(missing_fields)}'
        }), 400
    
    # Validate email format
    if '@' not in data['email'] or '.' not in data['email']:
        return jsonify({
            'error': 'Invalid email',
            'message': 'Please provide a valid email address'
        }), 400
    
    # Check password strength
    if len(data['password']) < 8:
        return jsonify({
            'error': 'Weak password',
            'message': 'Password must be at least 8 characters long'
        }), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({
            'error': 'User exists',
            'message': 'A user with this email already exists'
        }), 409
    
    # Create new user
    user = User(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    user.password = data['password']  # This will trigger the password setter
    
    # Save user to database
    db.session.add(user)
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user."""
    data = request.get_json()
    
    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({
            'error': 'Missing credentials',
            'message': 'Email and password are required'
        }), 400
    
    # Find user
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.verify_password(data['password']):
        # Use the same error message for both cases to avoid revealing which one failed
        return jsonify({
            'error': 'Invalid credentials',
            'message': 'Invalid email or password'
        }), 401
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    # Build response
    response = {
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }
    
    # Add token expiration info
    token_expires = datetime.datetime.now() + current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', datetime.timedelta(hours=1))
    response['token_expires_at'] = token_expires.isoformat()
    
    return jsonify(response), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
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

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get current user info."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({
            'error': 'User not found',
            'message': 'The user no longer exists'
        }), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout a user by revoking their tokens."""
    jti = get_jwt()['jti']
    revoked_tokens.add(jti)
    
    return jsonify({
        'message': 'Successfully logged out'
    }), 200

@auth_bp.route('/tokens', methods=['GET'])
@jwt_required()
def get_tokens():
    """Get the current user's active tokens."""
    current_user_id = get_jwt_identity()
    
    # In a real implementation, we would fetch actual tokens from a database
    # This is a placeholder implementation
    return jsonify({
        'tokens': [
            {
                'id': '1',
                'created_at': datetime.datetime.now().isoformat(),
                'expires_at': (datetime.datetime.now() + datetime.timedelta(days=30)).isoformat(),
                'description': 'Current session token'
            }
        ]
    }), 200

@auth_bp.route('/tokens/<string:token_id>', methods=['DELETE'])
@jwt_required()
def delete_token(token_id):
    """Delete/revoke a token."""
    # In a real implementation, we would delete the token from a database
    # For now we'll just return success
    return jsonify({
        'message': f'Token {token_id} has been revoked'
    }), 200 