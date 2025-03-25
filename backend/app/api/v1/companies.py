from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.company import Company, DataSharingPolicy
from app.models.user import User

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/', methods=['GET'])
@jwt_required()
def get_companies():
    """Get all companies."""
    companies = Company.query.all()
    return jsonify({
        'companies': [company.to_dict() for company in companies]
    }), 200

@companies_bp.route('/<string:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    """Get a specific company."""
    company = Company.query.get(company_id)
    
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
def get_company_sharing_policies(company_id):
    """Get data sharing policies for a company."""
    company = Company.query.get(company_id)
    
    if not company:
        return jsonify({
            'error': 'Company not found',
            'message': 'The company does not exist'
        }), 404
    
    policies = DataSharingPolicy.query.filter_by(company_id=company_id).all()
    
    return jsonify({
        'company': company.to_dict(),
        'policies': [policy.to_dict() for policy in policies]
    }), 200

@companies_bp.route('/<string:company_id>/related-companies', methods=['GET'])
@jwt_required()
def get_related_companies(company_id):
    """Get companies related to the specified company."""
    company = Company.query.get(company_id)
    
    if not company:
        return jsonify({
            'error': 'Company not found',
            'message': 'The company does not exist'
        }), 404
    
    related = company.related_companies.all()
    
    return jsonify({
        'company': company.to_dict(),
        'related_companies': [related_company.to_dict() for related_company in related]
    }), 200

# Admin routes for creating and managing companies

@companies_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    """Create a new company (admin only)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can create companies'
        }), 403
    
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({
            'error': 'Missing field',
            'message': 'Name is required'
        }), 400
    
    # Check if company already exists
    existing_company = Company.query.filter_by(name=data['name']).first()
    if existing_company:
        return jsonify({
            'error': 'Company exists',
            'message': 'A company with this name already exists'
        }), 409
    
    # Create new company
    company = Company(
        name=data['name'],
        logo=data.get('logo'),
        industry=data.get('industry'),
        website=data.get('website'),
        description=data.get('description'),
        size_range=data.get('size_range'),
        city=data.get('city'),
        state=data.get('state'),
        country=data.get('country')
    )
    
    # Save to database
    db.session.add(company)
    db.session.commit()
    
    return jsonify({
        'message': 'Company created successfully',
        'company': company.to_dict()
    }), 201 