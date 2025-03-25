from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.company import DataSharingPolicy, Company
from app.models.data_type import DataType
from app.models.user import User

data_sharing_terms_bp = Blueprint('data_sharing_terms', __name__)

@data_sharing_terms_bp.route('/', methods=['GET'])
@jwt_required()
def get_data_sharing_terms():
    """Get all data sharing terms."""
    terms = DataSharingPolicy.query.all()
    return jsonify({
        'data_sharing_terms': [term.to_dict() for term in terms]
    }), 200

@data_sharing_terms_bp.route('/<string:term_id>', methods=['GET'])
@jwt_required()
def get_data_sharing_term(term_id):
    """Get a specific data sharing term."""
    term = DataSharingPolicy.query.get(term_id)
    
    if not term:
        return jsonify({
            'error': 'Data sharing term not found',
            'message': 'The data sharing term does not exist'
        }), 404
    
    return jsonify({
        'data_sharing_term': term.to_dict()
    }), 200

# Admin routes for creating and managing data sharing terms

@data_sharing_terms_bp.route('/', methods=['POST'])
@jwt_required()
def create_data_sharing_term():
    """Create a new data sharing term (admin only)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can create data sharing terms'
        }), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['company_id', 'data_type_id', 'purpose']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': 'Missing field',
                'message': f'{field} is required'
            }), 400
    
    # Validate company exists
    company = Company.query.get(data['company_id'])
    if not company:
        return jsonify({
            'error': 'Not found',
            'message': 'Company not found'
        }), 404
    
    # Validate data type exists
    data_type = DataType.query.get(data['data_type_id'])
    if not data_type:
        return jsonify({
            'error': 'Not found',
            'message': 'Data type not found'
        }), 404
    
    # Create new data sharing term
    term = DataSharingPolicy(
        company_id=data['company_id'],
        data_type_id=data['data_type_id'],
        purpose=data['purpose'],
        description=data.get('description')
    )
    
    # Add third parties if provided
    if 'third_party_ids' in data and isinstance(data['third_party_ids'], list):
        for company_id in data['third_party_ids']:
            third_party = Company.query.get(company_id)
            if third_party:
                term.third_parties.append(third_party)
    
    # Save to database
    db.session.add(term)
    db.session.commit()
    
    return jsonify({
        'message': 'Data sharing term created successfully',
        'data_sharing_term': term.to_dict()
    }), 201

@data_sharing_terms_bp.route('/<string:term_id>/third-parties', methods=['POST'])
@jwt_required()
def add_third_party(term_id):
    """Add a third party to a data sharing term (admin only)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_admin:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Only administrators can modify data sharing terms'
        }), 403
    
    term = DataSharingPolicy.query.get(term_id)
    if not term:
        return jsonify({
            'error': 'Not found',
            'message': 'Data sharing term not found'
        }), 404
    
    data = request.get_json()
    
    if 'company_id' not in data:
        return jsonify({
            'error': 'Missing field',
            'message': 'company_id is required'
        }), 400
    
    company = Company.query.get(data['company_id'])
    if not company:
        return jsonify({
            'error': 'Not found',
            'message': 'Company not found'
        }), 404
    
    # Check if already a third party
    if company in term.third_parties:
        return jsonify({
            'error': 'Conflict',
            'message': 'Company is already a third party for this term'
        }), 409
    
    # Add third party
    term.third_parties.append(company)
    db.session.commit()
    
    return jsonify({
        'message': 'Third party added successfully',
        'data_sharing_term': term.to_dict()
    }), 200 