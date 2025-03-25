from datetime import datetime
from typing import Optional, Dict, Any
from app import supabase

class BaseModel:
    """Base model with common attributes and methods for Supabase."""
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.created_at = kwargs.get('created_at')
        self.updated_at = kwargs.get('updated_at')
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BaseModel':
        """Create a model instance from a dictionary."""
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary for API response."""
        return {
            'id': self.id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['BaseModel']:
        """Find a model by ID using Supabase."""
        response = supabase.table(cls.__tablename__).select('*').eq('id', id).execute()
        if response.data:
            return cls.from_dict(response.data[0])
        return None
    
    @classmethod
    async def get_all(cls) -> list['BaseModel']:
        """Get all instances of the model using Supabase."""
        response = supabase.table(cls.__tablename__).select('*').execute()
        return [cls.from_dict(item) for item in response.data]
    
    async def save(self) -> 'BaseModel':
        """Save the model to Supabase."""
        data = self.to_dict()
        if self.id:
            response = supabase.table(self.__tablename__).update(data).eq('id', self.id).execute()
        else:
            response = supabase.table(self.__tablename__).insert(data).execute()
        return self.from_dict(response.data[0])
    
    async def delete(self) -> bool:
        """Delete the model from Supabase."""
        if self.id:
            response = supabase.table(self.__tablename__).delete().eq('id', self.id).execute()
            return bool(response.data)
        return False 