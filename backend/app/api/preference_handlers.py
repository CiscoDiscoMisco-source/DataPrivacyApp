from app import db
from app.models.preference import Preference
from app.models.company import Company

def get_user_preferences(user_id, company_id=None, is_global=False, data_type=None):
    """Get user preferences based on filters"""
    # Build query
    query = Preference.query.filter_by(user_id=user_id)
    
    if company_id is not None:
        query = query.filter_by(company_id=company_id)
    elif is_global:
        query = query.filter_by(company_id=None)
    
    if data_type:
        query = query.filter_by(data_type=data_type)
    
    # Execute query
    return query.all()

def create_preference(user_id, data):
    """Create a new preference for a user"""
    # Validate input
    errors = {}
    if not data.get('data_type'):
        errors['data_type'] = 'Data type is required'
    if 'allowed' not in data:
        errors['allowed'] = 'Allowed flag is required'
    
    if errors:
        return {"error": errors}
    
    company_id = data.get('company_id')
    
    # If company_id is provided, check if it exists
    if company_id is not None:
        company = Company.query.get(company_id)
        if not company:
            return {"error": "Company not found"}
    
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
        return {"preference": existing_pref}
    
    # Create new preference
    preference = Preference(
        user_id=user_id,
        company_id=company_id,
        data_type=data['data_type'],
        allowed=data['allowed']
    )
    
    db.session.add(preference)
    db.session.commit()
    
    return {"preference": preference}

def update_user_preference(user_id, preference_id, data):
    """Update a specific preference"""
    # Validate input
    if 'allowed' not in data:
        return {"error": {'allowed': 'Allowed flag is required'}}
    
    # Get the preference
    preference = Preference.query.get(preference_id)
    
    if not preference:
        return {"error": 'Preference not found'}
    
    # Check if the preference belongs to the current user
    if preference.user_id != user_id:
        return {"error": 'Unauthorized'}
    
    # Update the preference
    preference.allowed = data['allowed']
    db.session.commit()
    
    return {"preference": preference}

def clone_user_preferences(user_id, data):
    """Clone preferences from one company to another"""
    # Validate input
    errors = {}
    if not data.get('source_company_id'):
        errors['source_company_id'] = 'Source company ID is required'
    if not data.get('target_company_id'):
        errors['target_company_id'] = 'Target company ID is required'
    
    if errors:
        return {"error": errors}
    
    source_id = data['source_company_id']
    target_id = data['target_company_id']
    
    # Check if companies exist
    source_company = Company.query.get(source_id)
    target_company = Company.query.get(target_id)
    
    if not source_company:
        return {"error": 'Source company not found'}
    if not target_company:
        return {"error": 'Target company not found'}
    
    # Get source preferences
    source_prefs = Preference.query.filter_by(
        user_id=user_id,
        company_id=source_id
    ).all()
    
    # Clone each preference
    cloned_prefs = []
    
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
    
    return {"count": len(cloned_prefs)} 