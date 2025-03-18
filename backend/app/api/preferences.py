from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from app import db
from app.models.preference import Preference
from app.models.company import Company
from app.utils.api_utils import api_response, validation_error

preferences_bp = Blueprint('preferences', __name__)

@preferences_bp.route('/preferences', methods=['GET'])
@jwt_required()
def get_preferences():
    """Get all preferences for the current user"""
    user_id = get_jwt_identity()
    
    # Get filter parameters
    company_id = request.args.get('company_id', type=int)
    is_global = request.args.get('global', default='false').lower() == 'true'
    data_type = request.args.get('data_type')
    
    # Build query
    query = Preference.query.filter_by(user_id=user_id)
    
    if company_id is not None:
        query = query.filter_by(company_id=company_id)
    elif is_global:
        query = query.filter_by(company_id=None)
    
    if data_type:
        query = query.filter_by(data_type=data_type)
    
    # Execute query
    preferences = query.all()
    
    return api_response(data=[pref.to_dict() for pref in preferences])

@preferences_bp.route('/preferences', methods=['POST'])
@jwt_required()
def set_preference():
    """Set a preference for the current user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    errors = {}
    if not data.get('data_type'):
        errors['data_type'] = 'Data type is required'
    if 'allowed' not in data:
        errors['allowed'] = 'Allowed flag is required'
    
    if errors:
        return validation_error(errors)
    
    company_id = data.get('company_id')
    
    # If company_id is provided, check if it exists
    if company_id is not None:
        company = Company.query.get(company_id)
        if not company:
            return api_response(message='Company not found', status=404)
    
    # Check if preference already exists
    existing_pref = Preference.query.filter_by(
        user_id=user_id,
        company_id=company_id,
        data_type=data['data_type']
    ).first()
    
    if existing_pref:
        # Update existing preference
        existing_pref.allowed = data['allowed']
        db.session.commit()
        return api_response(
            data={'preference': existing_pref.to_dict()},
            message='Preference updated'
        )
    
    # Create new preference
    preference = Preference(
        user_id=user_id,
        company_id=company_id,
        data_type=data['data_type'],
        allowed=data['allowed']
    )
    
    db.session.add(preference)
    db.session.commit()
    
    return api_response(
        data={'preference': preference.to_dict()},
        message='Preference created successfully',
        status=201
    )

@preferences_bp.route('/preferences/<int:preference_id>', methods=['PUT'])
@jwt_required()
def update_preference(preference_id):
    """Update a specific preference"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if 'allowed' not in data:
        return validation_error({'allowed': 'Allowed flag is required'})
    
    # Get the preference
    preference = Preference.query.get(preference_id)
    
    if not preference:
        return api_response(message='Preference not found', status=404)
    
    # Check if the preference belongs to the current user
    if preference.user_id != user_id:
        return api_response(message='Unauthorized', status=403)
    
    # Update the preference
    preference.allowed = data['allowed']
    db.session.commit()
    
    return api_response(
        data={'preference': preference.to_dict()},
        message='Preference updated'
    )

@preferences_bp.route('/preferences/clone', methods=['POST'])
@jwt_required()
def clone_preferences():
    """Clone preferences from one company to another"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    errors = {}
    if not data.get('source_company_id'):
        errors['source_company_id'] = 'Source company ID is required'
    if not data.get('target_company_id'):
        errors['target_company_id'] = 'Target company ID is required'
    
    if errors:
        return validation_error(errors)
    
    source_id = data['source_company_id']
    target_id = data['target_company_id']
    
    # Check if companies exist
    source_company = Company.query.get(source_id)
    target_company = Company.query.get(target_id)
    
    if not source_company:
        return api_response(message='Source company not found', status=404)
    if not target_company:
        return api_response(message='Target company not found', status=404)
    
    # Get source preferences
    source_prefs = Preference.query.filter_by(
        user_id=user_id,
        company_id=source_id
    ).all()
    
    # Store cloned preferences
    cloned_prefs = []
    
    # Clone each preference
    for source_pref in source_prefs:
        # Check if target preference already exists
        target_pref = Preference.query.filter_by(
            user_id=user_id,
            company_id=target_id,
            data_type=source_pref.data_type
        ).first()
        
        if target_pref:
            # Update existing preference
            target_pref.allowed = source_pref.allowed
        else:
            # Create new preference
            target_pref = Preference(
                user_id=user_id,
                company_id=target_id,
                data_type=source_pref.data_type,
                allowed=source_pref.allowed
            )
            db.session.add(target_pref)
        
        cloned_prefs.append(target_pref)
    
    db.session.commit()
    
    return api_response(
        data={'preferences': [pref.to_dict() for pref in cloned_prefs]},
        message=f'Cloned {len(cloned_prefs)} preferences from {source_company.name} to {target_company.name}'
    ) 