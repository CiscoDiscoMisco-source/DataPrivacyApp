from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.preference import UserPreference, UserProfilePreference
from app.models.data_type import DataType
from app.models.company import Company
from app.models.user import User

user_preferences_bp = Blueprint('user_preferences', __name__)

@user_preferences_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_preferences():
    """Get all preferences for the current user."""
    current_user_id = get_jwt_identity()
    
    # Get data type preferences
    preferences = UserPreference.query.filter_by(user_id=current_user_id).all()
    
    # Get profile preferences
    profile_prefs = UserProfilePreference.query.filter_by(user_id=current_user_id).first()
    
    return jsonify({
        'data_preferences': [pref.to_dict() for pref in preferences],
        'profile_preferences': profile_prefs.to_dict() if profile_prefs else None
    }), 200

@user_preferences_bp.route('/data', methods=['POST'])
@jwt_required()
def set_data_preference():
    """Set a data sharing preference."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['data_type_id', 'allowed']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': 'Missing field',
                'message': f'{field} is required'
            }), 400
    
    # Validate data type exists
    data_type = DataType.query.get(data['data_type_id'])
    if not data_type:
        return jsonify({
            'error': 'Not found',
            'message': 'Data type not found'
        }), 404
    
    # If company_id is provided, validate company exists
    company = None
    if 'company_id' in data and data['company_id']:
        company = Company.query.get(data['company_id'])
        if not company:
            return jsonify({
                'error': 'Not found',
                'message': 'Company not found'
            }), 404
    
    # Check if preference already exists
    preference = UserPreference.query.filter_by(
        user_id=current_user_id,
        data_type_id=data['data_type_id'],
        company_id=data.get('company_id')
    ).first()
    
    if preference:
        # Update existing preference
        preference.allowed = data['allowed']
    else:
        # Create new preference
        preference = UserPreference(
            user_id=current_user_id,
            data_type_id=data['data_type_id'],
            company_id=data.get('company_id'),
            allowed=data['allowed']
        )
        db.session.add(preference)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Preference updated successfully',
        'preference': preference.to_dict()
    }), 200

@user_preferences_bp.route('/profile', methods=['POST'])
@jwt_required()
def set_profile_preferences():
    """Set user profile preferences."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Find existing profile preferences or create new ones
    profile_prefs = UserProfilePreference.query.filter_by(user_id=current_user_id).first()
    
    if not profile_prefs:
        profile_prefs = UserProfilePreference(user_id=current_user_id)
        db.session.add(profile_prefs)
    
    # Update fields that are provided
    if 'email_notifications' in data:
        profile_prefs.email_notifications = data['email_notifications']
    
    if 'notification_frequency' in data:
        profile_prefs.notification_frequency = data['notification_frequency']
    
    if 'notification_types' in data:
        profile_prefs.notification_types = data['notification_types']
    
    if 'privacy_level' in data:
        profile_prefs.privacy_level = data['privacy_level']
    
    if 'auto_delete_data' in data:
        profile_prefs.auto_delete_data = data['auto_delete_data']
    
    if 'data_retention_period' in data:
        profile_prefs.data_retention_period = data['data_retention_period']
    
    if 'theme' in data:
        profile_prefs.theme = data['theme']
    
    if 'language' in data:
        profile_prefs.language = data['language']
    
    if 'timezone' in data:
        profile_prefs.timezone = data['timezone']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile preferences updated successfully',
        'preferences': profile_prefs.to_dict()
    }), 200

@user_preferences_bp.route('/data/clone', methods=['POST'])
@jwt_required()
def clone_preferences():
    """Clone preferences from one company to another."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if 'source_company_id' not in data or 'target_company_id' not in data:
        return jsonify({
            'error': 'Missing field',
            'message': 'source_company_id and target_company_id are required'
        }), 400
    
    # Validate companies exist
    source_company = Company.query.get(data['source_company_id'])
    target_company = Company.query.get(data['target_company_id'])
    
    if not source_company or not target_company:
        return jsonify({
            'error': 'Not found',
            'message': 'Source or target company not found'
        }), 404
    
    # Get source company preferences
    source_prefs = UserPreference.query.filter_by(
        user_id=current_user_id,
        company_id=data['source_company_id']
    ).all()
    
    # Clone preferences to target company
    cloned_prefs = []
    for pref in source_prefs:
        # Check if preference already exists for target
        existing_pref = UserPreference.query.filter_by(
            user_id=current_user_id,
            data_type_id=pref.data_type_id,
            company_id=data['target_company_id']
        ).first()
        
        if existing_pref:
            # Update existing preference
            existing_pref.allowed = pref.allowed
            cloned_prefs.append(existing_pref)
        else:
            # Create new preference
            new_pref = UserPreference(
                user_id=current_user_id,
                data_type_id=pref.data_type_id,
                company_id=data['target_company_id'],
                allowed=pref.allowed
            )
            db.session.add(new_pref)
            cloned_prefs.append(new_pref)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Preferences cloned successfully',
        'preferences': [pref.to_dict() for pref in cloned_prefs]
    }), 200 