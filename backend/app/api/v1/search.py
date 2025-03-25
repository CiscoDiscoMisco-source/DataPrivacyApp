from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.company import Company
from app.models.data_type import DataType
from app.models.preference import UserPreference
from sqlalchemy import or_

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['GET'])
@jwt_required()
def search():
    """Search across companies, data types, and preferences."""
    current_user_id = get_jwt_identity()
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({
            'error': 'Missing parameter',
            'message': 'Search query (q) is required'
        }), 400
    
    # Search companies
    companies = Company.query.filter(
        or_(
            Company.name.ilike(f'%{query}%'),
            Company.description.ilike(f'%{query}%'),
            Company.industry.ilike(f'%{query}%')
        )
    ).all()
    
    # Search data types
    data_types = DataType.query.filter(
        or_(
            DataType.name.ilike(f'%{query}%'),
            DataType.description.ilike(f'%{query}%'),
            DataType.category.ilike(f'%{query}%')
        )
    ).all()
    
    # Search user preferences (joining with data types and companies for names)
    preferences = UserPreference.query.join(
        DataType, UserPreference.data_type_id == DataType.id
    ).outerjoin(
        Company, UserPreference.company_id == Company.id
    ).filter(
        UserPreference.user_id == current_user_id,
        or_(
            DataType.name.ilike(f'%{query}%'),
            Company.name.ilike(f'%{query}%') if Company else False
        )
    ).all()
    
    return jsonify({
        'results': {
            'companies': [company.to_dict() for company in companies],
            'data_types': [data_type.to_dict() for data_type in data_types],
            'preferences': [preference.to_dict() for preference in preferences]
        }
    }), 200 