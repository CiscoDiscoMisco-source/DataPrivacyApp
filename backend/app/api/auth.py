from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity
)
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': 'Missing field',
                'message': f'{field} is required'
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
        return jsonify({
            'error': 'Invalid credentials',
            'message': 'Invalid email or password'
        }), 401
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'access_token': access_token
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
    """Logout a user.
    
    In a stateless JWT setup, we don't actually invalidate the token on the server.
    The frontend will remove the token from storage.
    This endpoint exists for compatibility with the frontend.
    """
    return jsonify({
        'message': 'Logout successful'
    }), 200 