import os
from datetime import timedelta

class Config:
    """Base config."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    # Use Supabase JWT secret for our app's JWT authentication
    SUPABASE_JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')
    JWT_SECRET_KEY = os.environ.get('SUPABASE_JWT_SECRET', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Supabase Configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')

class DevelopmentConfig(Config):
    """Development config."""
    DEBUG = True
    # Use Supabase connection string if available, otherwise fallback to local SQLite
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_POSTGRES_URL', 'sqlite:///dev.db')
    
class TestingConfig(Config):
    """Testing config."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_POSTGRES_URL', 'sqlite:///test.db')
    
class ProductionConfig(Config):
    """Production config."""
    DEBUG = False
    # Connect to Supabase PostgreSQL database
    SQLALCHEMY_DATABASE_URI = os.environ.get('POSTGRES_URL')
    
    # Fix for Vercel and Supabase: ensure postgresql:// protocol
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    
    # For horizontally scaling environments, use NullPool with transaction pooler
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'max_overflow': 15,
        'pool_timeout': 30,
        'pool_recycle': 1800,
    }
    SECRET_KEY = os.environ.get('SECRET_KEY')
    # Use Supabase JWT secret for production as well
    JWT_SECRET_KEY = os.environ.get('SUPABASE_JWT_SECRET') 