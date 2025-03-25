from flask_bcrypt import Bcrypt
from typing import Optional, Dict, Any
from .base import BaseModel

bcrypt = Bcrypt()

class User(BaseModel):
    """User model for authentication and profile data."""
    __tablename__ = 'users'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.email = kwargs.get('email')
        self.password_hash = kwargs.get('password_hash')
        self.first_name = kwargs.get('first_name')
        self.last_name = kwargs.get('last_name')
        self.is_admin = kwargs.get('is_admin', False)
        self.tokens = kwargs.get('tokens', 0)
    
    @property
    def password(self):
        """Prevent password from being accessed."""
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        """Set password to a hashed password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Check if hashed password matches actual password."""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary for API response."""
        base_dict = super().to_dict()
        base_dict.update({
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_admin': self.is_admin,
            'tokens': self.tokens
        })
        return base_dict

class TokenPackage(BaseModel):
    """Token packages that users can purchase."""
    __tablename__ = 'token_packages'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = kwargs.get('name')
        self.amount = kwargs.get('amount')
        self.price = kwargs.get('price')
        self.description = kwargs.get('description')
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert token package to dictionary for API response."""
        base_dict = super().to_dict()
        base_dict.update({
            'name': self.name,
            'amount': self.amount,
            'price': self.price,
            'description': self.description
        })
        return base_dict 