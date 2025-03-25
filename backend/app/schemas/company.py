from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanySchema:
    """Schema for company data."""
    def __init__(self, **kwargs):
        self.id: Optional[int] = kwargs.get('id')
        self.name: str = kwargs.get('name', '')
        self.user_id: Optional[str] = kwargs.get('user_id')
        self.logo: Optional[str] = kwargs.get('logo')
        self.industry: Optional[str] = kwargs.get('industry')
        self.website: Optional[str] = kwargs.get('website')
        self.description: Optional[str] = kwargs.get('description')
        self.size_range: Optional[str] = kwargs.get('size_range')
        self.city: Optional[str] = kwargs.get('city')
        self.state: Optional[str] = kwargs.get('state')
        self.country: Optional[str] = kwargs.get('country')
        self.created_at: Optional[datetime] = kwargs.get('created_at')
        self.updated_at: Optional[datetime] = kwargs.get('updated_at')
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CompanySchema':
        """Create a schema instance from a dictionary."""
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert schema to dictionary for API response."""
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'logo': self.logo,
            'industry': self.industry,
            'website': self.website,
            'description': self.description,
            'size_range': self.size_range,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class DataSharingPolicySchema:
    """Schema for data sharing policy."""
    def __init__(self, **kwargs):
        self.id: Optional[int] = kwargs.get('id')
        self.company_id: int = kwargs.get('company_id', 0)
        self.data_type_id: int = kwargs.get('data_type_id', 0)
        self.purpose: str = kwargs.get('purpose', '')
        self.description: Optional[str] = kwargs.get('description')
        self.created_at: Optional[datetime] = kwargs.get('created_at')
        self.updated_at: Optional[datetime] = kwargs.get('updated_at')
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'DataSharingPolicySchema':
        """Create a schema instance from a dictionary."""
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert schema to dictionary for API response."""
        return {
            'id': self.id,
            'company_id': self.company_id,
            'data_type_id': self.data_type_id,
            'purpose': self.purpose,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 