from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from app import db
from app.models.preference import Preference
from app.models.company import Company
from app.utils.api_utils import api_response, validation_error
from app.api.preference_handlers import get_user_preferences, create_preference, update_user_preference, clone_user_preferences

preferences_bp = Blueprint('preferences', __name__)

@preferences_bp.route('/preferences', methods=['GET'])
@jwt_required()
def get_preferences():
    """Get all preferences for the current user"""
    user_id = get_jwt_identity()
    company_id = request.args.get('company_id', type=int)
    is_global = request.args.get('global', default='false').lower() == 'true'
    data_type = request.args.get('data_type')
    
    preferences = get_user_preferences(user_id, company_id, is_global, data_type)
    return api_response(data=[pref.to_dict() for pref in preferences])

@preferences_bp.route('/preferences', methods=['POST'])
@jwt_required()
def set_preference():
    """Set a preference for the current user"""
    user_id = get_jwt_identity()
    result = create_preference(user_id, request.json)
    
    if "error" in result:
        return validation_error(result["error"])
    
    return api_response(
        message="Preference created successfully",
        data=result["preference"].to_dict()
    ), 201

@preferences_bp.route('/preferences/<int:preference_id>', methods=['PUT'])
@jwt_required()
def update_preference(preference_id):
    """Update a user preference"""
    user_id = get_jwt_identity()
    result = update_user_preference(user_id, preference_id, request.json)
    
    if "error" in result:
        return validation_error(result["error"])
    
    return api_response(
        message="Preference updated successfully",
        data=result["preference"].to_dict()
    )

@preferences_bp.route('/preferences/clone', methods=['POST'])
@jwt_required()
def clone_preferences():
    """Clone preferences from one company to another"""
    user_id = get_jwt_identity()
    result = clone_user_preferences(user_id, request.json)
    
    if "error" in result:
        return validation_error(result["error"])
    
    return api_response(
        message=f"Successfully cloned {result['count']} preferences",
        data={"count": result["count"]}
    ), 201 