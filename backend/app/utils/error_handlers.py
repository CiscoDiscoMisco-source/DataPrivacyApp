from flask import jsonify
import logging
from werkzeug.exceptions import HTTPException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIError(Exception):
    """Base class for API errors"""
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

class ValidationError(APIError):
    """Raised when input validation fails"""
    def __init__(self, message, payload=None):
        super().__init__(message, status_code=400, payload=payload)

class AuthenticationError(APIError):
    """Raised when authentication fails"""
    def __init__(self, message, payload=None):
        super().__init__(message, status_code=401, payload=payload)

class AuthorizationError(APIError):
    """Raised when authorization fails"""
    def __init__(self, message, payload=None):
        super().__init__(message, status_code=403, payload=payload)

class NotFoundError(APIError):
    """Raised when a resource is not found"""
    def __init__(self, message, payload=None):
        super().__init__(message, status_code=404, payload=payload)

def register_error_handlers(app):
    """Register error handlers for the application"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Handle API errors"""
        logger.error(f"API Error: {error.message}", exc_info=True)
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        """Handle HTTP errors"""
        logger.error(f"HTTP Error: {error.description}", exc_info=True)
        response = jsonify({
            'message': error.description,
            'error': error.name
        })
        response.status_code = error.code
        return response

    @app.errorhandler(Exception)
    def handle_generic_error(error):
        """Handle unexpected errors"""
        logger.error(f"Unexpected Error: {str(error)}", exc_info=True)
        response = jsonify({
            'message': 'An unexpected error occurred',
            'error': 'Internal Server Error'
        })
        response.status_code = 500
        return response 