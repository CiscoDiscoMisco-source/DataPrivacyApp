from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.services.elasticsearch_service import ElasticsearchService
from app.models.company import Company
from app.utils.api_utils import api_response

search_bp = Blueprint('search', __name__)
es_service = ElasticsearchService()

@search_bp.route('/search/companies', methods=['GET'])
@jwt_required()
def search_companies():
    """Search for companies by name or domain"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', default=10, type=int)
    
    if not query:
        return api_response(data=[], message='Query parameter is required')
    
    # Try to search in Elasticsearch first
    if es_service.get_client():
        results = es_service.search_companies(query, limit)
        if results:
            return api_response(data=results)
    
    # Fallback to database search if Elasticsearch is not available or returned no results
    companies = Company.query.filter(
        Company.name.ilike(f'%{query}%') | Company.domain.ilike(f'%{query}%')
    ).limit(limit).all()
    
    return api_response(data=[company.to_dict() for company in companies]) 