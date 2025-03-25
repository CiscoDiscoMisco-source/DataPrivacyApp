from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
import sys

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration based on environment
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    if config_name == 'production':
        from app.config.production import ProductionConfig
        app.config.from_object(ProductionConfig)
        
        # If using Supabase's connection pooler in horizontally scaling environments
        if 'pooler.supabase.co' in os.environ.get('POSTGRES_URL', ''):
            from sqlalchemy.pool import NullPool
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
                'poolclass': NullPool
            }
    elif config_name == 'testing':
        from app.config.testing import TestingConfig
        app.config.from_object(TestingConfig)
    else:
        from app.config.development import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    # Ensure SQLALCHEMY_DATABASE_URI is set - fail if not found
    if not app.config.get('SQLALCHEMY_DATABASE_URI'):
        print("ERROR: POSTGRES_URL environment variable is not set!")
        print("Please set the POSTGRES_URL environment variable to your Supabase PostgreSQL connection string")
        print("Exiting application...")
        sys.exit(1)
    
    # Fix for SQLAlchemy PostgreSQL dialect
    if app.config.get('SQLALCHEMY_DATABASE_URI') and app.config.get('SQLALCHEMY_DATABASE_URI').startswith('postgres://'):
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config.get('SQLALCHEMY_DATABASE_URI').replace('postgres://', 'postgresql://', 1)
    
    # Ensure Supabase credentials are set - fail if not found
    if not app.config.get('SUPABASE_URL') or not app.config.get('SUPABASE_KEY'):
        print("ERROR: Supabase credentials are not set!")
        print("Please set the SUPABASE_URL and SUPABASE_KEY environment variables")
        print("Exiting application...")
        sys.exit(1)
    
    # Enable CORS
    CORS(app)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register API v1 blueprints
    from app.api.v1.auth import auth_bp
    from app.api.v1.companies import companies_bp
    from app.api.v1.data_types import data_types_bp
    from app.api.v1.user_preferences import user_preferences_bp
    from app.api.v1.data_sharing_terms import data_sharing_terms_bp
    from app.api.v1.users import users_bp
    from app.api.v1.search import search_bp
    
    # Register with versioned URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(companies_bp, url_prefix='/api/v1/companies')
    app.register_blueprint(data_types_bp, url_prefix='/api/v1/data-types')
    app.register_blueprint(user_preferences_bp, url_prefix='/api/v1/user-preferences')
    app.register_blueprint(data_sharing_terms_bp, url_prefix='/api/v1/data-sharing-terms')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(search_bp, url_prefix='/api/v1/search')
    
    # Create database tables if they don't exist - Updated for Flask 2.3+
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint for Vercel"""
        from app.utils.supabase_client import test_connection
        connection_status = test_connection()
        status = 'healthy' if connection_status['postgres']['connected'] else 'unhealthy'
        return {'status': status, 'connections': connection_status}, 200 if status == 'healthy' else 503
    
    return app 