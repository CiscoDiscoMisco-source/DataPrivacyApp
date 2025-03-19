from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.company import Company
from app.models.data_sharing_term import DataSharingTerm
from app.services.elasticsearch_service import ElasticsearchService
from app.utils.api_utils import api_response, validation_error
from app.api.company_handlers import (
    get_companies_with_terms_for_user,
    create_new_company,
    add_term_to_company
)

companies_bp = Blueprint('companies', __name__)
es_service = ElasticsearchService()

@companies_bp.route('/user/companies', methods=['GET'])
@jwt_required()
def get_user_companies():
    """Get all companies and terms for the current user"""
    user_id = get_jwt_identity()
    companies_data = get_companies_with_terms_for_user(user_id)
    return api_response(data=companies_data)

@companies_bp.route('/companies', methods=['POST'])
@jwt_required()
def create_company():
    """Create a new company"""
    user_id = get_jwt_identity()
    result = create_new_company(user_id, request.json, es_service)
    
    if "error" in result:
        return validation_error(result["error"])
    
    return api_response(
        message="Company created successfully", 
        data=result["company"].to_dict()
    ), 201

@companies_bp.route('/companies/<int:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    """Get a specific company by ID"""
    company = Company.query.get(company_id)
    
    if not company:
        return api_response(message="Company not found", status=404)
    
    return api_response(data=company.to_dict())

@companies_bp.route('/companies/<int:company_id>/terms', methods=['POST'])
@jwt_required()
def add_data_sharing_term(company_id):
    """Add a data sharing term for a company"""
    user_id = get_jwt_identity()
    result = add_term_to_company(user_id, company_id, request.json)
    
    if "error" in result:
        return validation_error(result["error"])
    
    return api_response(
        message="Data sharing term added successfully",
        data=result["term"].to_dict()
    ), 201 