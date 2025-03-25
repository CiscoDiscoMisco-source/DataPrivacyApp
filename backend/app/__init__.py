from flask import Flask, jsonify
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
from app.db import init_supabase_client

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
        logger.error("Please set the SUPABASE_URL and SUPABASE_ANON_KEY environment variables")
        sys.exit(1)
    
    # Initialize Supabase clients with enhanced connection handling
    supabase_url = app.config.get('SUPABASE_URL')
    supabase_anon_key = app.config.get('SUPABASE_ANON_KEY')
    
    # Regular client initialization with retry logic
    supabase = init_supabase_client(
        url=supabase_url,
        key=supabase_anon_key,
        is_admin=False,
        max_retries=3
    )
    
    if not supabase:
        logger.error("Failed to initialize Supabase client. Application cannot proceed.")
        # In production, you might want to continue with degraded functionality
        if config_name == 'production':
            logger.warning("Continuing with degraded functionality in production mode.")
            # Create the client anyway for production, but log the warning
            supabase = create_client(supabase_url, supabase_anon_key)
        else:
            sys.exit(1)
    
    app.supabase = supabase
    
    # Initialize Supabase admin client with service role key if available
    if app.config.get('SUPABASE_SERVICE_ROLE_KEY'):
        supabase_service_key = app.config.get('SUPABASE_SERVICE_ROLE_KEY')
        
        # Admin client initialization with retry logic
        supabase_admin = init_supabase_client(
            url=supabase_url,
            key=supabase_service_key,
            is_admin=True,
            max_retries=3
        )
        
        if not supabase_admin:
            logger.warning("Failed to initialize Supabase admin client. Admin operations will not be available.")
            app.supabase_admin = None
        else:
            app.supabase_admin = supabase_admin
    else:
        logger.warning("SUPABASE_SERVICE_ROLE_KEY not set. Admin operations will not be available.")
        app.supabase_admin = None
    
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
    from app.api.v1.users import users_bp
    from app.api.v1.tokens import tokens_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(companies_bp, url_prefix='/api/v1/companies')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(tokens_bp, url_prefix='/api/v1/tokens')
    
    # Add a health check endpoint
    @app.route('/health')
    def health_check():
        """Health check endpoint to verify the application is running."""
        health_status = {"status": "ok", "version": "1.0.0"}
        
        # Check Supabase connection
        if hasattr(app, 'supabase'):
            try:
                response = app.supabase.table("companies").select("count").limit(1).execute()
                health_status["database"] = "connected"
            except Exception as e:
                health_status["database"] = "error"
                health_status["database_error"] = str(e)
        else:
            health_status["database"] = "not_configured"
        
        return jsonify(health_status)
    
    return app 