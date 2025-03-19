"""
User model module defining the User database model and related functionality.
"""
from app import db
from app.models.base import BaseModel, TimestampMixin
from werkzeug.security import generate_password_hash, check_password_hash
import re

class User(BaseModel, TimestampMixin):
    """
    User model representing application users.
    Handles user authentication and profile information.
    """
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Relationships
    companies = db.relationship('Company', backref='owner', lazy=True)
    preferences = db.relationship('UserPreferences', backref='user', uselist=False, lazy=True)
    
    def __init__(self, email, password, first_name, last_name, **kwargs):
        """
        Initialize a new User instance.
        
        Args:
            email (str): User's email address
            password (str): User's password (will be hashed)
            first_name (str): User's first name
            last_name (str): User's last name
            **kwargs: Additional keyword arguments
        """
        super().__init__(**kwargs)
        self.email = email.lower().strip()
        self.set_password(password)
        self.first_name = first_name.strip()
        self.last_name = last_name.strip()
    
    def set_password(self, password):
        """
        Set the user's password hash.
        
        Args:
            password (str): The password to hash and store
        """
        if not self._is_valid_password(password):
            raise ValueError("Password does not meet security requirements")
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """
        Check if the provided password matches the stored hash.
        
        Args:
            password (str): The password to check
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def _is_valid_password(password):
        """
        Validate password strength.
        
        Args:
            password (str): The password to validate
            
        Returns:
            bool: True if password meets requirements, False otherwise
        """
        if not password or len(password) < 8:
            return False
        
        # Check for at least one uppercase letter
        if not re.search(r"[A-Z]", password):
            return False
        
        # Check for at least one lowercase letter
        if not re.search(r"[a-z]", password):
            return False
        
        # Check for at least one number
        if not re.search(r"\d", password):
            return False
        
        # Check for at least one special character
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False
        
        return True
    
    @staticmethod
    def _is_valid_email(email):
        """
        Validate email format.
        
        Args:
            email (str): The email to validate
            
        Returns:
            bool: True if email is valid, False otherwise
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def to_dict(self):
        """
        Convert user to dictionary representation.
        
        Returns:
            dict: User data as dictionary
        """
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the User model."""
        return f'<User {self.email}>' 