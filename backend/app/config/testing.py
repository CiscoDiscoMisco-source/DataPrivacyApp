"""Testing configuration."""
import os

class TestingConfig:
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_POSTGRES_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SUPABASE_URL = os.environ.get('TEST_SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('TEST_SUPABASE_KEY')
    JWT_SECRET_KEY = 'test-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour 