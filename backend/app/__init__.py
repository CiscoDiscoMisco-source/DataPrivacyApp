import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app(config=None):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure the application
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-dev-key-change-in-production')
    
    # Apply configuration overrides if provided
    if config:
        app.config.update(config)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    limiter.init_app(app)
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.companies import companies_bp
    from app.api.preferences import preferences_bp
    from app.api.search import search_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(companies_bp, url_prefix='/api')
    app.register_blueprint(preferences_bp, url_prefix='/api')
    app.register_blueprint(search_bp, url_prefix='/api')
    
    # Create database tables if not in production
    if os.getenv('FLASK_ENV') != 'production':
        with app.app_context():
            db.create_all()
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'ok'}, 200
    
    return app 