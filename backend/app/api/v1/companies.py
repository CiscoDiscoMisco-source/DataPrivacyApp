from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import get_supabase
from app.models.company import Company, DataSharingPolicy
from app.models.user import User
from app.schemas.company import CompanySchema

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/', methods=['GET'])
@jwt_required()
async def get_companies():
    """Get all companies for the current user (RLS compatible)."""
    current_user_id = get_jwt_identity()
    companies = await Company.get_user_companies(current_user_id)
    
    return jsonify({
        'companies': [company.to_dict() for company in companies]
    }), 200

@companies_bp.route('/<string:company_id>', methods=['GET'])
@jwt_required()
async def get_company(company_id):
    """Get a specific company."""
    company = await Company.find_by_id(company_id)
    
    if not company:
        return jsonify({
            'error': 'Company not found',
            'message': 'The company does not exist'
        }), 404
    
    return jsonify({
        'company': company.to_dict()
    }), 200

@companies_bp.route('/<string:company_id>/sharing-policies', methods=['GET'])
@jwt_required()
async def get_company_sharing_policies(company_id):
    """Get data sharing policies for a company."""
    company = await Company.find_by_id(company_id)
    
    if not company:
        return jsonify({
            'error': 'Company not found',
            'message': 'The company does not exist'
        }), 404
    
    policies = await DataSharingPolicy.get_company_policies(company_id)
    
    return jsonify({
        'company': company.to_dict(),
        'policies': [policy.to_dict() for policy in policies]
    }), 200

@companies_bp.route('/<string:company_id>/related-companies', methods=['GET'])
@jwt_required()
async def get_related_companies(company_id):
    """Get companies related to the specified company."""
    company = await Company.find_by_id(company_id)
    
    if not company:
        return jsonify({
            'error': 'Company not found',
            'message': 'The company does not exist'
        }), 404
    
    related = await company.get_related_companies()
    
    return jsonify({
        'company': company.to_dict(),
        'related_companies': [related_company.to_dict() for related_company in related]
    }), 200

# Routes for creating and managing companies

@companies_bp.route('/', methods=['POST'])
@jwt_required()
async def create_company():
    """Create a new company with current user as owner."""
    current_user_id = get_jwt_identity()
    
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({
            'error': 'Missing field',
            'message': 'Name is required'
        }), 400
    
    # Create a schema from the data
    company_data = {
        'name': data['name'],
        'user_id': current_user_id,  # Set the user_id for RLS
        'logo': data.get('logo'),
        'industry': data.get('industry'),
        'website': data.get('website'),
        'description': data.get('description'),
        'size_range': data.get('size_range'),
        'city': data.get('city'),
        'state': data.get('state'),
        'country': data.get('country')
    }
    
    # Create and save the company
    company_schema = CompanySchema(**company_data)
    company = Company(company_schema)
    saved_company = await company.save()
    
    return jsonify({
        'message': 'Company created successfully',
        'company': saved_company.to_dict()
    }), 201 