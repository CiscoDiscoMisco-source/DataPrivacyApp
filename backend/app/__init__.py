from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os

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
        app.config.from_object('app.config.ProductionConfig')
    elif config_name == 'testing':
        app.config.from_object('app.config.TestingConfig')
    else:
        app.config.from_object('app.config.DevelopmentConfig')
    
    # Enable CORS
    CORS(app)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.companies import companies_bp
    from app.api.data_types import data_types_bp
    from app.api.user_preferences import user_preferences_bp
    from app.api.data_sharing_terms import data_sharing_terms_bp
    from app.api.users import users_bp
    from app.api.search import search_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')
    app.register_blueprint(data_types_bp, url_prefix='/api/data-types')
    app.register_blueprint(user_preferences_bp, url_prefix='/api/user-preferences')
    app.register_blueprint(data_sharing_terms_bp, url_prefix='/api/data-sharing-terms')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    
    # Create database tables if they don't exist
    @app.before_first_request
    def create_tables():
        db.create_all()
    
    return app 