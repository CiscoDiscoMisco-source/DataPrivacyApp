"""
UserPreferences model module defining the UserPreferences database model and related functionality.
"""
from app import db
from app.models.base import BaseModel, TimestampMixin
from enum import Enum

class NotificationFrequency(Enum):
    """Enumeration of possible notification frequencies."""
    IMMEDIATE = "immediate"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    NEVER = "never"

class UserPreferences(BaseModel, TimestampMixin):
    """
    UserPreferences model representing user preferences and settings.
    Handles notification preferences, privacy settings, and other user-specific configurations.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Notification Preferences
    email_notifications = db.Column(db.Boolean, default=True)
    notification_frequency = db.Column(db.Enum(NotificationFrequency), default=NotificationFrequency.IMMEDIATE)
    notification_types = db.Column(db.JSON)  # Store notification type preferences as JSON
    
    # Privacy Settings
    data_sharing_preferences = db.Column(db.JSON)  # Store data sharing preferences as JSON
    privacy_level = db.Column(db.String(20), default='balanced')  # strict, balanced, permissive
    
    # UI Preferences
    theme = db.Column(db.String(20), default='light')  # light, dark, system
    language = db.Column(db.String(10), default='en')
    timezone = db.Column(db.String(50))
    
    # Data Management
    data_retention_period = db.Column(db.Integer)  # in days
    auto_delete_data = db.Column(db.Boolean, default=False)
    
    def __init__(self, user_id, **kwargs):
        """
        Initialize a new UserPreferences instance.
        
        Args:
            user_id (int): ID of the user
            **kwargs: Additional keyword arguments
        """
        super().__init__(**kwargs)
        self.user_id = user_id
        self.notification_types = {
            'data_sharing_requests': True,
            'data_access_attempts': True,
            'privacy_policy_updates': True,
            'security_alerts': True
        }
        self.data_sharing_preferences = {
            'allow_analytics': True,
            'allow_marketing': False,
            'allow_third_party': False,
            'data_collection': True
        }
    
    def update_notification_preferences(self, **kwargs):
        """
        Update notification preferences.
        
        Args:
            **kwargs: Notification preference fields to update
        """
        allowed_fields = {
            'email_notifications', 'notification_frequency', 'notification_types'
        }
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                if field == 'notification_types' and isinstance(value, dict):
                    self.notification_types.update(value)
                else:
                    setattr(self, field, value)
    
    def update_privacy_settings(self, **kwargs):
        """
        Update privacy settings.
        
        Args:
            **kwargs: Privacy setting fields to update
        """
        allowed_fields = {
            'data_sharing_preferences', 'privacy_level', 'data_retention_period',
            'auto_delete_data'
        }
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                if field == 'data_sharing_preferences' and isinstance(value, dict):
                    self.data_sharing_preferences.update(value)
                else:
                    setattr(self, field, value)
    
    def update_ui_preferences(self, **kwargs):
        """
        Update UI preferences.
        
        Args:
            **kwargs: UI preference fields to update
        """
        allowed_fields = {'theme', 'language', 'timezone'}
        
        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(self, field, value)
    
    def should_notify(self, notification_type):
        """
        Check if user should be notified for a specific type.
        
        Args:
            notification_type (str): Type of notification
            
        Returns:
            bool: True if user should be notified, False otherwise
        """
        if not self.email_notifications:
            return False
        
        return self.notification_types.get(notification_type, False)
    
    def to_dict(self):
        """
        Convert user preferences to dictionary representation.
        
        Returns:
            dict: User preferences data as dictionary
        """
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email_notifications': self.email_notifications,
            'notification_frequency': self.notification_frequency.value,
            'notification_types': self.notification_types,
            'data_sharing_preferences': self.data_sharing_preferences,
            'privacy_level': self.privacy_level,
            'theme': self.theme,
            'language': self.language,
            'timezone': self.timezone,
            'data_retention_period': self.data_retention_period,
            'auto_delete_data': self.auto_delete_data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the UserPreferences model."""
        return f'<UserPreferences {self.user_id}>' 