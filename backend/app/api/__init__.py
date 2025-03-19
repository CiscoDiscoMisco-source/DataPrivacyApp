from flask import Blueprint

# Import blueprints
from app.api.auth import auth_bp
from app.api.companies import companies_bp
from app.api.preferences import preferences_bp
from app.api.search import search_bp

# Create submodule level __all__ to define API
__all__ = ['auth_bp', 'companies_bp', 'preferences_bp', 'search_bp'] 