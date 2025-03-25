from typing import Optional, Dict, Any
from app.schemas.preference import UserPreferenceSchema, UserProfilePreferenceSchema
from app.repositories.preference import UserPreferenceRepository, UserProfilePreferenceRepository

class UserPreference:
    """User preference model for storing privacy preferences."""
    TABLE_NAME = 'user_preferences'
    
    def __init__(self, schema: UserPreferenceSchema):
        self._schema = schema
        self._repository = UserPreferenceRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def user_id(self) -> int:
        return self._schema.user_id
    
    @property
    def data_type_id(self) -> int:
        return self._schema.data_type_id
    
    @property
    def company_id(self) -> Optional[int]:
        return self._schema.company_id
    
    @property
    def allowed(self) -> bool:
        return self._schema.allowed
    
    @property
    def created_at(self):
        return self._schema.created_at
    
    @property
    def updated_at(self):
        return self._schema.updated_at
    
    def to_dict(self) -> Dict[str, Any]:
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
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['UserPreference']:
        """Find a user preference by ID."""
        schema = await UserPreferenceRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    async def save(self) -> 'UserPreference':
        """Save the user preference."""
        if self.id:
            self._schema = await self._repository.update(self._schema)
        else:
            self._schema = await self._repository.create(self._schema)
        return self

class UserProfilePreference:
    """User profile preferences for notifications, theme, language, etc."""
    TABLE_NAME = 'user_profile_preferences'
    
    def __init__(self, schema: UserProfilePreferenceSchema):
        self._schema = schema
        self._repository = UserProfilePreferenceRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def user_id(self) -> int:
        return self._schema.user_id
    
    @property
    def email_notifications(self) -> bool:
        return self._schema.email_notifications
    
    @property
    def notification_frequency(self) -> str:
        return self._schema.notification_frequency
    
    @property
    def notification_types(self):
        return self._schema.notification_types
    
    @property
    def privacy_level(self) -> str:
        return self._schema.privacy_level
    
    @property
    def auto_delete_data(self) -> bool:
        return self._schema.auto_delete_data
    
    @property
    def data_retention_period(self) -> Optional[int]:
        return self._schema.data_retention_period
    
    @property
    def theme(self) -> str:
        return self._schema.theme
    
    @property
    def language(self) -> str:
        return self._schema.language
    
    @property
    def timezone(self) -> Optional[str]:
        return self._schema.timezone
    
    @property
    def created_at(self):
        return self._schema.created_at
    
    @property
    def updated_at(self):
        return self._schema.updated_at
    
    def to_dict(self) -> Dict[str, Any]:
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
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['UserProfilePreference']:
        """Find a user profile preference by ID."""
        schema = await UserProfilePreferenceRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    async def save(self) -> 'UserProfilePreference':
        """Save the user profile preference."""
        if self.id:
            self._schema = await self._repository.update(self._schema)
        else:
            self._schema = await self._repository.create(self._schema)
        return self 