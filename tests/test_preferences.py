import json
import pytest
from app import create_app, db
from app.models.user import User
from app.models.company import Company
from app.models.preference import Preference
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
        company2 = Company(
            name='Test Company 2',
            domain='company2.com',
            description='Test company 2 description'
        )
        db.session.add(company1)
        db.session.add(company2)
        
        db.session.commit()
        
        # Create test preferences
        global_pref = Preference(
            user_id=test_user.user_id,
            data_type='Email',
            allowed=False
        )
        local_pref = Preference(
            user_id=test_user.user_id,
            company_id=company1.company_id,
            data_type='Location',
            allowed=True
        )
        db.session.add(global_pref)
        db.session.add(local_pref)
        
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

def test_get_preferences(client):
    """Test getting user preferences"""
    response = client.get('/api/preferences')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 2  # 1 global pref, 1 local pref

def test_get_global_preferences(client):
    """Test getting global preferences"""
    response = client.get('/api/preferences?global=true')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['company_id'] is None
    assert data['data'][0]['data_type'] == 'Email'

def test_get_company_preferences(client):
    """Test getting company-specific preferences"""
    # Get company ID
    with client.application.app_context():
        company = Company.query.filter_by(name='Test Company 1').first()
    
    response = client.get(f'/api/preferences?company_id={company.company_id}')
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['company_id'] == company.company_id
    assert data['data'][0]['data_type'] == 'Location'

def test_set_preference(client):
    """Test setting a new preference"""
    # Create new preference
    response = client.post('/api/preferences', json={
        'data_type': 'Browsing History',
        'allowed': True
    })
    
    # Check response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['preference']['data_type'] == 'Browsing History'
    assert data['data']['preference']['allowed'] is True
    assert data['data']['preference']['company_id'] is None  # Global preference

def test_set_company_preference(client):
    """Test setting a company-specific preference"""
    # Get company ID
    with client.application.app_context():
        company = Company.query.filter_by(name='Test Company 2').first()
    
    # Create new company-specific preference
    response = client.post('/api/preferences', json={
        'data_type': 'Purchase History',
        'allowed': False,
        'company_id': company.company_id
    })
    
    # Check response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['data']['preference']['data_type'] == 'Purchase History'
    assert data['data']['preference']['allowed'] is False
    assert data['data']['preference']['company_id'] == company.company_id

def test_update_preference(client):
    """Test updating an existing preference"""
    # Get preference ID
    with client.application.app_context():
        user = User.query.filter_by(username='testuser').first()
        pref = Preference.query.filter_by(
            user_id=user.user_id,
            data_type='Email'
        ).first()
    
    # Update preference
    response = client.put(f'/api/preferences/{pref.preference_id}', json={
        'allowed': True
    })
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    
    # Verify preference was updated
    with client.application.app_context():
        updated_pref = Preference.query.get(pref.preference_id)
        assert updated_pref.allowed is True

def test_clone_preferences(client):
    """Test cloning preferences from one company to another"""
    # Get company IDs
    with client.application.app_context():
        company1 = Company.query.filter_by(name='Test Company 1').first()
        company2 = Company.query.filter_by(name='Test Company 2').first()
    
    # Add another preference to company1
    client.post('/api/preferences', json={
        'data_type': 'Marketing',
        'allowed': True,
        'company_id': company1.company_id
    })
    
    # Clone preferences from company1 to company2
    response = client.post('/api/preferences/clone', json={
        'source_company_id': company1.company_id,
        'target_company_id': company2.company_id
    })
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    
    # Verify preferences were cloned
    response = client.get(f'/api/preferences?company_id={company2.company_id}')
    data = json.loads(response.data)
    
    # Should have 2 preferences (Location and Marketing)
    assert len(data['data']) == 2
    
    # Check that values match source preferences
    prefs_data = {pref['data_type']: pref['allowed'] for pref in data['data']}
    assert 'Location' in prefs_data
    assert 'Marketing' in prefs_data
    assert prefs_data['Location'] is True
    assert prefs_data['Marketing'] is True 