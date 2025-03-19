from app import db
from app.models.company import Company
from app.models.data_sharing_term import DataSharingTerm

def get_companies_with_terms_for_user(user_id):
    """Get all companies and their data sharing terms for a specific user"""
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
    
    return list(company_terms.values())

def create_new_company(user_id, data, es_service=None):
    """Create a new company"""
    # Validate input
    errors = {}
    if not data.get('name'):
        errors['name'] = 'Company name is required'
    if not data.get('domain'):
        errors['domain'] = 'Domain is required'
    
    if errors:
        return {"error": errors}
    
    # Check if company already exists
    if Company.query.filter_by(domain=data['domain']).first():
        return {"error": {'domain': 'Company with this domain already exists'}}
    
    # Create new company
    company = Company(
        name=data['name'],
        domain=data['domain'],
        description=data.get('description')
    )
    
    db.session.add(company)
    db.session.commit()
    
    # Index in Elasticsearch if service is available
    if es_service:
        es_service.index_company(company)
    
    return {"company": company}

def add_term_to_company(user_id, company_id, data):
    """Add a data sharing term to a company for a user"""
    # Validate input
    errors = {}
    if not data.get('data_type'):
        errors['data_type'] = 'Data type is required'
    if not data.get('terms'):
        errors['terms'] = 'Terms text is required'
    
    if errors:
        return {"error": errors}
    
    # Check if company exists
    company = Company.query.get(company_id)
    if not company:
        return {"error": 'Company not found'}
    
    # Check if term already exists and update it
    existing_term = DataSharingTerm.query.filter_by(
        company_id=company_id,
        user_id=user_id,
        data_type=data['data_type']
    ).first()
    
    if existing_term:
        existing_term.terms = data['terms']
        db.session.commit()
        return {"term": existing_term}
    
    # Create new term
    term = DataSharingTerm(
        company_id=company_id,
        user_id=user_id,
        data_type=data['data_type'],
        terms=data['terms']
    )
    
    db.session.add(term)
    db.session.commit()
    
    return {"term": term} 