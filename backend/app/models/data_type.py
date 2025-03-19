"""
DataType model module defining the DataType database model and related functionality.
"""
from app import db
from app.models.base import BaseModel, TimestampMixin
from enum import Enum
import re

class DataCategory(Enum):
    """Enumeration of possible data categories."""
    PERSONAL = "personal"
    CONTACT = "contact"
    FINANCIAL = "financial"
    HEALTH = "health"
    LOCATION = "location"
    BEHAVIORAL = "behavioral"
    TECHNICAL = "technical"
    OTHER = "other"

class DataType(BaseModel, TimestampMixin):
    """
    DataType model representing different types of data that companies can collect.
    Defines the structure and validation rules for each data type.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.Enum(DataCategory), nullable=False)
    is_sensitive = db.Column(db.Boolean, default=False)
    retention_period = db.Column(db.Integer)  # in days
    is_required = db.Column(db.Boolean, default=False)
    validation_rules = db.Column(db.JSON)  # Store validation rules as JSON
    is_active = db.Column(db.Boolean, default=True)
    
    # Foreign Keys
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    
    # Relationships
    data_sharing_terms = db.relationship('DataSharingTerm', backref='data_type', lazy=True)
    
    def __init__(self, name, category, company_id, **kwargs):
        """
        Initialize a new DataType instance.
        
        Args:
            name (str): Name of the data type
            category (DataCategory): Category of the data type
            company_id (int): ID of the company that owns this data type
            **kwargs: Additional keyword arguments
        """
        super().__init__(**kwargs)
        self.name = name.strip()
        self.category = category
        self.company_id = company_id
    
    def set_validation_rules(self, rules):
        """
        Set validation rules for the data type.
        
        Args:
            rules (dict): Dictionary containing validation rules
        """
        if not isinstance(rules, dict):
            raise ValueError("Validation rules must be a dictionary")
        
        # Validate required fields in rules
        required_fields = {'type', 'required', 'min_length', 'max_length'}
        if not all(field in rules for field in required_fields):
            raise ValueError("Validation rules missing required fields")
        
        self.validation_rules = rules
    
    def validate_data(self, value):
        """
        Validate data against the defined rules.
        
        Args:
            value: The value to validate
            
        Returns:
            bool: True if value is valid, False otherwise
        """
        if not self.validation_rules:
            return True
        
        rules = self.validation_rules
        
        # Check required field
        if rules['required'] and not value:
            return False
        
        # Check type
        if rules['type'] == 'string':
            if not isinstance(value, str):
                return False
            if len(value) < rules['min_length']:
                return False
            if len(value) > rules['max_length']:
                return False
        elif rules['type'] == 'number':
            try:
                num = float(value)
                if 'min' in rules and num < rules['min']:
                    return False
                if 'max' in rules and num > rules['max']:
                    return False
            except (ValueError, TypeError):
                return False
        elif rules['type'] == 'email':
            if not isinstance(value, str):
                return False
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(pattern, value):
                return False
        
        return True
    
    def to_dict(self):
        """
        Convert data type to dictionary representation.
        
        Returns:
            dict: Data type data as dictionary
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category.value,
            'is_sensitive': self.is_sensitive,
            'retention_period': self.retention_period,
            'is_required': self.is_required,
            'validation_rules': self.validation_rules,
            'is_active': self.is_active,
            'company_id': self.company_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the DataType model."""
        return f'<DataType {self.name}>' 