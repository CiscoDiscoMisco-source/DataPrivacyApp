from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.data_type import DataType
from app.models.user import User

data_types_bp = Blueprint('data_types', __name__)

@data_types_bp.route('/', methods=['GET'])
@jwt_required()
def get_data_types():
    """Get all data types."""
    data_types = DataType.query.all()
    return jsonify({
        'data_types': [data_type.to_dict() for data_type in data_types]
    }), 200

@data_types_bp.route('/<string:data_type_id>', methods=['GET'])
@jwt_required()
def get_data_type(data_type_id):
    """Get a specific data type."""
    data_type = DataType.query.get(data_type_id)
    
    if not data_type:
        return jsonify({
            'error': 'Data type not found',
            'message': 'The data type does not exist'
        }), 404
    
    return jsonify({
        'data_type': data_type.to_dict()
    }), 200

# Admin routes for creating and managing data types

@data_types_bp.route('/', methods=['POST'])
@jwt_required()
def create_data_type():
    """Create a new data type (admin only)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can create data types'
        }), 403
    
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({
            'error': 'Missing field',
            'message': 'Name is required'
        }), 400
    
    # Check if data type already exists
    existing_data_type = DataType.query.filter_by(name=data['name']).first()
    if existing_data_type:
        return jsonify({
            'error': 'Data type exists',
            'message': 'A data type with this name already exists'
        }), 409
    
    # Create new data type
    data_type = DataType(
        name=data['name'],
        description=data.get('description'),
        category=data.get('category'),
        sensitivity_level=data.get('sensitivity_level')
    )
    
    # Save to database
    db.session.add(data_type)
    db.session.commit()
    
    return jsonify({
        'message': 'Data type created successfully',
        'data_type': data_type.to_dict()
    }), 201 