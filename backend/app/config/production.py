"""Production configuration."""
import os

class ProductionConfig:
    """Production configuration."""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('POSTGRES_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    SUPABASE_JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')

    # Use Supabase JWT secret for our app's JWT authentication
    JWT_SECRET_KEY = os.environ.get('SUPABASE_JWT_SECRET')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour 