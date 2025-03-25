"""Testing configuration."""
import os

class TestingConfig:
    """Testing configuration."""
    DEBUG = False
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_POSTGRES_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'test-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour 