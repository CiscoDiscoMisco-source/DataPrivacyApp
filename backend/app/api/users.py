from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or not current_user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can view all users'
        }), 403
    
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@users_bp.route('/<string:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a specific user (admin or self)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Allow users to view their own data, or admins to view any user
    if current_user_id != user_id and (not current_user or not current_user.is_admin):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to view this user'
        }), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({
            'error': 'Not found',
            'message': 'User not found'
        }), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@users_bp.route('/<string:user_id>/tokens', methods=['POST'])
@jwt_required()
def add_tokens(user_id):
    """Add tokens to a user (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or not current_user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can add tokens to users'
        }), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({
            'error': 'Not found',
            'message': 'User not found'
        }), 404
    
    data = request.get_json()
    
    if 'amount' not in data or not isinstance(data['amount'], int) or data['amount'] <= 0:
        return jsonify({
            'error': 'Invalid input',
            'message': 'Amount must be a positive integer'
        }), 400
    
    user.tokens += data['amount']
    db.session.commit()
    
    return jsonify({
        'message': f'{data["amount"]} tokens added to user',
        'user': user.to_dict()
    }), 200

@users_bp.route('/<string:user_id>/admin', methods=['PUT'])
@jwt_required()
def toggle_admin(user_id):
    """Toggle admin status for a user (admin only)."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or not current_user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can change admin status'
        }), 403
    
    # Prevent changing own admin status
    if current_user_id == user_id:
        return jsonify({
            'error': 'Forbidden',
            'message': 'You cannot change your own admin status'
        }), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({
            'error': 'Not found',
            'message': 'User not found'
        }), 404
    
    data = request.get_json()
    
    if 'is_admin' not in data or not isinstance(data['is_admin'], bool):
        return jsonify({
            'error': 'Invalid input',
            'message': 'is_admin must be a boolean'
        }), 400
    
    user.is_admin = data['is_admin']
    db.session.commit()
    
    return jsonify({
        'message': f'Admin status updated for user',
        'user': user.to_dict()
    }), 200 