from app import db
from .base import BaseModel

class UserPreference(BaseModel):
    """User preference model for storing privacy preferences."""
    __tablename__ = 'user_preferences'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    data_type_id = db.Column(db.String(36), db.ForeignKey('data_types.id'), nullable=False)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=True)  # If null, it's a global preference
    allowed = db.Column(db.Boolean, default=False, nullable=False)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'data_type_id', 'company_id', name='uix_user_data_company'),
    )
    
    def to_dict(self):
        """Convert user preference to dictionary for API response."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'data_type_id': self.data_type_id,
            'company_id': self.company_id,
            'allowed': self.allowed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
class UserProfilePreference(BaseModel):
    """User profile preferences for notifications, theme, language, etc."""
    __tablename__ = 'user_profile_preferences'
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, unique=True)
    email_notifications = db.Column(db.Boolean, default=True)
    notification_frequency = db.Column(db.String(50), default='daily')
    notification_types = db.Column(db.JSON)
    privacy_level = db.Column(db.String(50), default='moderate')
    auto_delete_data = db.Column(db.Boolean, default=False)
    data_retention_period = db.Column(db.Integer)  # in days
    theme = db.Column(db.String(50), default='light')
    language = db.Column(db.String(10), default='en')
    timezone = db.Column(db.String(50))
    
    def to_dict(self):
        """Convert user profile preference to dictionary for API response."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email_notifications': self.email_notifications,
            'notification_frequency': self.notification_frequency,
            'notification_types': self.notification_types,
            'privacy_level': self.privacy_level,
            'auto_delete_data': self.auto_delete_data,
            'data_retention_period': self.data_retention_period,
            'theme': self.theme,
            'language': self.language,
            'timezone': self.timezone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 