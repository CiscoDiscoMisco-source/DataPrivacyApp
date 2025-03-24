from app import db
from .base import BaseModel

class DataType(BaseModel):
    """Data type model for categorizing types of personal data."""
    __tablename__ = 'data_types'
    
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    sensitivity_level = db.Column(db.String(50))
    
    # Relationships
    data_sharing_policies = db.relationship('DataSharingPolicy', backref='data_type', lazy='dynamic')
    user_preferences = db.relationship('UserPreference', backref='data_type', lazy='dynamic')
    
    def to_dict(self):
        """Convert data type to dictionary for API response."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'sensitivity_level': self.sensitivity_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 