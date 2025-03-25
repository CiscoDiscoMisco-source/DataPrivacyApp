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
    try:
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return jsonify({
                'error': 'Authentication error',
                'message': 'You must be logged in to create a company'
            }), 401
        
        data = request.get_json()
        
        # Validate required fields
        if 'name' not in data:
            return jsonify({
                'error': 'Missing field',
                'message': 'Name is required'
            }), 400
        
        # Check if company with same name already exists
        supabase = get_supabase()
        existing = supabase.table('companies').select('*').eq('name', data['name']).execute()
        if existing.data and len(existing.data) > 0:
            return jsonify({
                'error': 'Company exists',
                'message': 'A company with this name already exists'
            }), 409
            
        # Direct insertion method (similar to generate_dummy_data_final.py)
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
        
        # Direct insertion using Supabase client
        try:
            response = supabase.table('companies').insert(company_data).execute()
            
            if response.data and len(response.data) > 0:
                # Convert the response data to a Company object
                company_schema = CompanySchema.from_dict(response.data[0])
                company = Company(company_schema)
                
                return jsonify({
                    'message': 'Company created successfully',
                    'company': company.to_dict()
                }), 201
            else:
                return jsonify({
                    'error': 'Database error',
                    'message': 'Failed to create company: No data returned from database'
                }), 500
        except Exception as e:
            return jsonify({
                'error': 'Database error',
                'message': f'Failed to insert company: {str(e)}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'Failed to process request: {str(e)}'
        }), 500

@companies_bp.route('/bulk', methods=['POST'])
@jwt_required()
async def create_companies_bulk():
    """Create multiple companies in a single request (admin only)."""
    try:
        current_user_id = get_jwt_identity()
        user = await User.find_by_id(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({
                'error': 'Forbidden',
                'message': 'Only administrators can create companies in bulk'
            }), 403
        
        data = request.get_json()
        
        if not isinstance(data, list) or len(data) == 0:
            return jsonify({
                'error': 'Invalid data',
                'message': 'Request must contain an array of company objects'
            }), 400
        
        # Prepare company data for bulk insertion
        companies_data = []
        for company_item in data:
            # Validate required fields
            if 'name' not in company_item:
                return jsonify({
                    'error': 'Missing field',
                    'message': 'Name is required for all companies'
                }), 400
                
            # Create company data structure
            company_data = {
                'name': company_item['name'],
                'user_id': current_user_id,  # Set the user_id for RLS
                'logo': company_item.get('logo'),
                'industry': company_item.get('industry'),
                'website': company_item.get('website'),
                'description': company_item.get('description'),
                'size_range': company_item.get('size_range'),
                'city': company_item.get('city'),
                'state': company_item.get('state'),
                'country': company_item.get('country')
            }
            companies_data.append(company_data)
        
        # Direct bulk insertion using Supabase client (similar to generate_dummy_data_final.py)
        supabase = get_supabase()
        try:
            response = supabase.table('companies').insert(companies_data).execute()
            
            if response.data and len(response.data) > 0:
                # Convert response data to Company objects
                created_companies = []
                for company_data in response.data:
                    company_schema = CompanySchema.from_dict(company_data)
                    company = Company(company_schema)
                    created_companies.append(company.to_dict())
                
                return jsonify({
                    'message': f'Successfully created {len(created_companies)} companies',
                    'companies': created_companies
                }), 201
            else:
                return jsonify({
                    'error': 'Database error',
                    'message': 'Failed to create companies: No data returned from database'
                }), 500
        except Exception as e:
            return jsonify({
                'error': 'Database error',
                'message': f'Failed to insert companies: {str(e)}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': f'Failed to process request: {str(e)}'
        }), 500 