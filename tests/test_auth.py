import json
import pytest
from app import create_app, db
from app.models.user import User

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
        db.session.commit()
    
    with app.test_client() as client:
        yield client
    
    # Clean up database
    with app.app_context():
        db.drop_all()

def test_register(client):
    """Test user registration"""
    response = client.post('/api/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'newpassword123'
    })
    
    # Check response
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'user' in data['data']
    assert 'access_token' in data['data']
    assert data['data']['user']['username'] == 'newuser'

def test_login(client):
    """Test user login"""
    response = client.post('/api/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'user' in data['data']
    assert 'access_token' in data['data']
    assert data['data']['user']['username'] == 'testuser'

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/api/login', json={
        'username': 'testuser',
        'password': 'wrongpassword'
    })
    
    # Check response
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data['status'] == 'error'
    assert 'Invalid username or password' in data['message']

def test_get_current_user(client):
    """Test getting current user with JWT token"""
    # First login to get token
    login_response = client.post('/api/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    data = json.loads(login_response.data)
    token = data['data']['access_token']
    
    # Use token to access protected route
    response = client.get('/api/me', headers={
        'Authorization': f'Bearer {token}'
    })
    
    # Check response
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'user' in data['data']
    assert data['data']['user']['username'] == 'testuser' 