import json
import pytest
from app import create_app, db
from app.models.user import User
from app.models.company import Company
from app.models.data_sharing_term import DataSharingTerm
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    """Create a test client for the app"""
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
    })
    
    # Create the database and tables
    with app.app_context():
        db.create_all()
        
        # Create a test user
        test_user = User(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        db.session.add(test_user)
        
        # Create test companies
        company1 = Company(
            name='Test Company 1',
            domain='company1.com',
            description='Test company 1 description'
        )
        db.session.add(company1)
        
        db.session.commit()
        
        # Create test data sharing terms
        term = DataSharingTerm(
            company_id=company1.company_id,
            user_id=test_user.user_id,
            data_type='Email',
            terms='Your email may be used for marketing purposes'
        )
        db.session.add(term)
        
        db.session.commit()
    
    with app.test_client() as client:
        with app.app_context():
            # Create access token for test user
            user = User.query.filter_by(username='testuser').first()
            access_token = create_access_token(identity=user.user_id)
            client.environ_base['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
            
            yield client
    
    # Clean up database
    with app.app_context():
        db.drop_all()

def test_get_user_companies(client):
    """Test getting user's companies"""
    response = client.get('/api/user/companies')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['company']['name'] == 'Test Company 1'
    assert len(data['data'][0]['terms']) == 1
    assert data['data'][0]['terms'][0]['data_type'] == 'Email'

def test_get_company(client):
    """Test getting a company by ID"""
    # Get company ID
    with client.application.app_context():
        company = Company.query.filter_by(name='Test Company 1').first()
    
    response = client.get(f'/api/companies/{company.company_id}')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['company']['name'] == 'Test Company 1'
    assert data['data']['company']['domain'] == 'company1.com'

def test_create_company(client):
    """Test creating a new company"""
    response = client.post('/api/companies', json={
        'name': 'New Company',
        'domain': 'newcompany.com',
        'description': 'A new test company'
    })
    
    # Check response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['company']['name'] == 'New Company'
    assert data['data']['company']['domain'] == 'newcompany.com'
    
    # Verify the company was created in the database
    with client.application.app_context():
        company = Company.query.filter_by(domain='newcompany.com').first()
        assert company is not None
        assert company.name == 'New Company'

def test_create_duplicate_company(client):
    """Test creating a company with an existing domain"""
    response = client.post('/api/companies', json={
        'name': 'Duplicate Company',
        'domain': 'company1.com',  # This domain already exists
        'description': 'A duplicate company'
    })
    
    # Check response
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['status'] == 'error'
    assert 'domain' in data['data']['errors']

def test_add_data_sharing_term(client):
    """Test adding a data sharing term to a company"""
    # Get company ID
    with client.application.app_context():
        company = Company.query.filter_by(name='Test Company 1').first()
    
    response = client.post(f'/api/companies/{company.company_id}/terms', json={
        'data_type': 'Location',
        'terms': 'Your location data may be used for targeted advertising'
    })
    
    # Check response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['term']['data_type'] == 'Location'
    
    # Verify the term was added in the database
    with client.application.app_context():
        user = User.query.filter_by(username='testuser').first()
        term = DataSharingTerm.query.filter_by(
            company_id=company.company_id,
            user_id=user.user_id,
            data_type='Location'
        ).first()
        assert term is not None
        assert term.terms == 'Your location data may be used for targeted advertising'

def test_update_data_sharing_term(client):
    """Test updating an existing data sharing term"""
    # Get company ID
    with client.application.app_context():
        company = Company.query.filter_by(name='Test Company 1').first()
    
    response = client.post(f'/api/companies/{company.company_id}/terms', json={
        'data_type': 'Email',  # This data type already exists for this company
        'terms': 'Updated terms for email data'
    })
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['term']['data_type'] == 'Email'
    assert data['data']['term']['terms'] == 'Updated terms for email data'
    
    # Verify the term was updated in the database
    with client.application.app_context():
        user = User.query.filter_by(username='testuser').first()
        term = DataSharingTerm.query.filter_by(
            company_id=company.company_id,
            user_id=user.user_id,
            data_type='Email'
        ).first()
        assert term is not None
        assert term.terms == 'Updated terms for email data' 