"""
Company model module defining the Company database model and related functionality.
"""
from app import db
from app.models.base import BaseModel, TimestampMixin
import re

class Company(BaseModel, TimestampMixin):
    """
    Company model representing organizations in the system.
    Handles company information and relationships with users and data types.
    """
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    size_range = db.Column(db.String(50))  # e.g., "1-10", "11-50", "51-200", etc.
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))
    address = db.Column(db.Text)
    postal_code = db.Column(db.String(20))
    phone = db.Column(db.String(20))
    is_active = db.Column(db.Boolean, default=True)
    
    # Foreign Keys
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    data_types = db.relationship('DataType', backref='company', lazy=True)
    data_sharing_terms = db.relationship('DataSharingTerm', backref='company', lazy=True)
    
    def __init__(self, name, owner_id, **kwargs):
        """
        Initialize a new Company instance.
        
        Args:
            name (str): Company name
            owner_id (int): ID of the user who owns the company
            **kwargs: Additional keyword arguments
        """
        super().__init__(**kwargs)
        self.name = name.strip()
        self.owner_id = owner_id
    
    def update_contact_info(self, **kwargs):
        """
        Update company contact information.
        
        Args:
            **kwargs: Contact information fields to update
        """
        allowed_fields = {
            'website', 'phone', 'address', 'city', 'state', 
            'country', 'postal_code'
        }
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(self, field, value.strip() if isinstance(value, str) else value)
    
    @staticmethod
    def _is_valid_website(url):
        """
        Validate website URL format.
        
        Args:
            url (str): The URL to validate
            
        Returns:
            bool: True if URL is valid, False otherwise
        """
        if not url:
            return True
        pattern = r'^https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$'
        return bool(re.match(pattern, url))
    
    @staticmethod
    def _is_valid_phone(phone):
        """
        Validate phone number format.
        
        Args:
            phone (str): The phone number to validate
            
        Returns:
            bool: True if phone number is valid, False otherwise
        """
        if not phone:
            return True
        pattern = r'^\+?1?\d{9,15}$'
        return bool(re.match(pattern, phone))
    
    def to_dict(self):
        """
        Convert company to dictionary representation.
        
        Returns:
            dict: Company data as dictionary
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'website': self.website,
            'industry': self.industry,
            'size_range': self.size_range,
            'country': self.country,
            'state': self.state,
            'city': self.city,
            'address': self.address,
            'postal_code': self.postal_code,
            'phone': self.phone,
            'is_active': self.is_active,
            'owner_id': self.owner_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the Company model."""
        return f'<Company {self.name}>' 