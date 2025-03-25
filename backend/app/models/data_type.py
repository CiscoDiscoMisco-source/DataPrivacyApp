from typing import Optional, Dict, Any, List
from app.schemas.data_type import DataTypeSchema
from app.repositories.data_type import DataTypeRepository

class DataType:
    """Data type model for categorizing types of personal data."""
    TABLE_NAME = 'data_types'
    
    def __init__(self, schema: DataTypeSchema):
        self._schema = schema
        self._repository = DataTypeRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def name(self) -> str:
        return self._schema.name
    
    @property
    def description(self) -> Optional[str]:
        return self._schema.description
    
    @property
    def category(self) -> Optional[str]:
        return self._schema.category
    
    @property
    def sensitivity_level(self) -> Optional[str]:
        return self._schema.sensitivity_level
    
    @property
    def created_at(self):
        return self._schema.created_at
    
    @property
    def updated_at(self):
        return self._schema.updated_at
    
    def to_dict(self) -> Dict[str, Any]:
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
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['DataType']:
        """Find a data type by ID."""
        schema = await DataTypeRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['DataType']:
        """Get all data types."""
        schemas = await DataTypeRepository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> 'DataType':
        """Save the data type."""
        if self.id:
            self._schema = await self._repository.update(self._schema)
        else:
            self._schema = await self._repository.create(self._schema)
        return self 