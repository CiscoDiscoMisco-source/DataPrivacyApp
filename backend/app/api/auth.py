from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.utils.api_utils import api_response, validation_error
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    errors = {}
    if not data.get('email'):
        errors['email'] = 'Email is required'
    if not data.get('password'):
        errors['password'] = 'Password is required'
    elif len(data.get('password', '')) < 8:
        errors['password'] = 'Password must be at least 8 characters'
    if not data.get('name'):
        errors['name'] = 'Name is required'
    if not data.get('lastName'):
        errors['lastName'] = 'Last name is required'
    if not data.get('birthDate'):
        errors['birthDate'] = 'Birth date is required'
    if not data.get('nationalId'):
        errors['nationalId'] = 'National ID number is required'
    
    if errors:
        return validation_error(errors)
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        errors['email'] = 'Email already exists'
    
    if User.query.filter_by(national_id=data['nationalId']).first():
        errors['nationalId'] = 'National ID already exists'
    
    if errors:
        return validation_error(errors)
    
    try:
        # Parse birth date
        birth_date = datetime.strptime(data['birthDate'], '%Y-%m-%d').date()
        
        # Create new user
        user = User(
            email=data['email'],
            password=data['password'],
            first_name=data['name'],
            last_name=data['lastName'],
            birth_date=birth_date,
            national_id=data['nationalId']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return api_response(
            data={
                'user': user.to_dict(),
                'access_token': access_token
            },
            message='User registered successfully',
            status=201
        )
    except ValueError as e:
        return validation_error({'general': str(e)})
    except Exception as e:
        db.session.rollback()
        return api_response(
            message=f'Registration failed: {str(e)}',
            status=500
        )

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate a user and return a JWT token"""
    data = request.get_json()
    
    # Validate input
    if not data.get('email') or not data.get('password'):
        return validation_error({'auth': 'Email and password are required'})
    
    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return api_response(message='Invalid email or password', status=401)
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return api_response(
        data={
            'user': user.to_dict(),
            'access_token': access_token
        },
        message='Login successful'
    )

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get the current user's profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return api_response(message='User not found', status=404)
    
    return api_response(data={'user': user.to_dict()}) 