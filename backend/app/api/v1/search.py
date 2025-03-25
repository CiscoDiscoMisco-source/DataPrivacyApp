from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.company import Company
from app.models.data_type import DataType
from app.models.preference import UserPreference
from app.db import get_supabase

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['GET'])
@jwt_required()
async def search():
    """Search across companies, data types, and preferences."""
    current_user_id = get_jwt_identity()
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({
            'error': 'Missing parameter',
            'message': 'Search query (q) is required'
        }), 400
    
    supabase = get_supabase()
    
    # Search companies
    companies = supabase.table('companies').select('*').ilike('name', f'%{query}%').execute()
    
    # Search data types
    data_types = supabase.table('data_types').select('*').ilike('name', f'%{query}%').execute()
    
    # Search user preferences
    preferences = supabase.table('user_preferences').select('*').eq('user_id', current_user_id).execute()
    
    return jsonify({
        'companies': companies.data,
        'data_types': data_types.data,
        'preferences': preferences.data
    }) 