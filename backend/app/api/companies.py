from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.company import Company
from app.models.data_sharing_term import DataSharingTerm
from app.services.elasticsearch_service import ElasticsearchService
from app.utils.api_utils import api_response, validation_error

companies_bp = Blueprint('companies', __name__)
es_service = ElasticsearchService()

@companies_bp.route('/user/companies', methods=['GET'])
@jwt_required()
def get_user_companies():
    """Get all companies and terms for the current user"""
    user_id = get_jwt_identity()
    
    # Get all data sharing terms for the user
    terms = DataSharingTerm.query.filter_by(user_id=user_id).all()
    
    # Group terms by company
    company_terms = {}
    for term in terms:
        if term.company_id not in company_terms:
            # Fetch the company info
            company = Company.query.get(term.company_id)
            if company:
                company_terms[term.company_id] = {
                    'company': company.to_dict(),
                    'terms': []
                }
            else:
                continue
        
        company_terms[term.company_id]['terms'].append(term.to_dict())
    
    return api_response(data=list(company_terms.values()))

@companies_bp.route('/companies', methods=['POST'])
@jwt_required()
def create_company():
    """Create a new company (admin only)"""
    data = request.get_json()
    
    # Validate input
    errors = {}
    if not data.get('name'):
        errors['name'] = 'Company name is required'
    if not data.get('domain'):
        errors['domain'] = 'Domain is required'
    
    if errors:
        return validation_error(errors)
    
    # Check if company already exists
    if Company.query.filter_by(domain=data['domain']).first():
        return validation_error({'domain': 'Company with this domain already exists'})
    
    # Create new company
    company = Company(
        name=data['name'],
        domain=data['domain'],
        description=data.get('description')
    )
    
    db.session.add(company)
    db.session.commit()
    
    # Index in Elasticsearch
    es_service.index_company(company)
    
    return api_response(
        data={'company': company.to_dict()},
        message='Company created successfully',
        status=201
    )

@companies_bp.route('/companies/<int:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    """Get a company by ID"""
    company = Company.query.get(company_id)
    
    if not company:
        return api_response(message='Company not found', status=404)
    
    return api_response(data={'company': company.to_dict()})

@companies_bp.route('/companies/<int:company_id>/terms', methods=['POST'])
@jwt_required()
def add_data_sharing_term(company_id):
    """Add a data sharing term to a company for the current user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    errors = {}
    if not data.get('data_type'):
        errors['data_type'] = 'Data type is required'
    if not data.get('terms'):
        errors['terms'] = 'Terms text is required'
    
    if errors:
        return validation_error(errors)
    
    # Check if company exists
    company = Company.query.get(company_id)
    if not company:
        return api_response(message='Company not found', status=404)
    
    # Check if term already exists and update it
    existing_term = DataSharingTerm.query.filter_by(
        company_id=company_id,
        user_id=user_id,
        data_type=data['data_type']
    ).first()
    
    if existing_term:
        existing_term.terms = data['terms']
        db.session.commit()
        return api_response(
            data={'term': existing_term.to_dict()},
            message='Data sharing term updated'
        )
    
    # Create new term
    term = DataSharingTerm(
        company_id=company_id,
        user_id=user_id,
        data_type=data['data_type'],
        terms=data['terms']
    )
    
    db.session.add(term)
    db.session.commit()
    
    return api_response(
        data={'term': term.to_dict()},
        message='Data sharing term added successfully',
        status=201
    ) 