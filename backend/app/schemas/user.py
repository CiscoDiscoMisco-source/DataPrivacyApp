from typing import Optional, Dict, Any
from datetime import datetime

class UserSchema:
    """Schema for user data."""
    def __init__(self, **kwargs):
        self.id: Optional[int] = kwargs.get('id')
        self.email: str = kwargs.get('email', '')
        self.password_hash: str = kwargs.get('password_hash', '')
        self.first_name: str = kwargs.get('first_name', '')
        self.last_name: str = kwargs.get('last_name', '')
        self.is_admin: bool = kwargs.get('is_admin', False)
        self.tokens: int = kwargs.get('tokens', 0)
        self.created_at: Optional[datetime] = kwargs.get('created_at')
        self.updated_at: Optional[datetime] = kwargs.get('updated_at')
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserSchema':
        """Create a schema instance from a dictionary."""
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert schema to dictionary for API response."""
        return {
            'id': self.id,
            'email': self.email,
            'password_hash': self.password_hash,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_admin': self.is_admin,
            'tokens': self.tokens,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class TokenPackageSchema:
    """Schema for token package data."""
    def __init__(self, **kwargs):
        self.id: Optional[int] = kwargs.get('id')
        self.name: str = kwargs.get('name', '')
        self.amount: int = kwargs.get('amount', 0)
        self.price: float = kwargs.get('price', 0.0)
        self.description: Optional[str] = kwargs.get('description')
        self.created_at: Optional[datetime] = kwargs.get('created_at')
        self.updated_at: Optional[datetime] = kwargs.get('updated_at')
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'TokenPackageSchema':
        """Create a schema instance from a dictionary."""
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert schema to dictionary for API response."""
        return {
            'id': self.id,
            'name': self.name,
            'amount': self.amount,
            'price': self.price,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 