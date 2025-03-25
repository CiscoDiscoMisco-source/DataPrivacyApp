from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
import sys
from dotenv import load_dotenv
from app.utils.error_handlers import register_error_handlers
from app.models.token import RevokedToken
import logging
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load environment variables from .env.production in production
    if os.environ.get('FLASK_ENV') == 'production':
        load_dotenv('.env.production')
    else:
        load_dotenv()
    
    # Load configuration based on environment
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    if config_name == 'production':
        from app.config.production import ProductionConfig
        app.config.from_object(ProductionConfig)
    elif config_name == 'testing':
        from app.config.testing import TestingConfig
        app.config.from_object(TestingConfig)
    else:
        from app.config.development import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    # Ensure Supabase credentials are set - fail if not found
    if not app.config.get('SUPABASE_URL') or not app.config.get('SUPABASE_ANON_KEY'):
        logger.error("Supabase credentials are not set!")
        logger.error("Please set the SUPABASE_URL and SUPABASE_KEY environment variables")
        sys.exit(1)
    
    # Initialize Supabase client
    supabase: Client = create_client(
        app.config.get('SUPABASE_URL'),
        app.config.get('SUPABASE_ANON_KEY')
    )
    app.supabase = supabase
    
    # Enable CORS
    CORS(app)
    
    # Initialize extensions with app
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register error handlers
    register_error_handlers(app)
    
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
    
    # Clean up expired tokens on startup
    RevokedToken.cleanup_expired(app.supabase)
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint for Vercel"""
        try:
            # Test Supabase connection
            app.supabase.table('users').select('count').limit(1).execute()
            return {'status': 'healthy', 'database': 'connected'}, 200
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {'status': 'unhealthy', 'database': 'disconnected'}, 503
    
    return app 