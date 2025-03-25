from typing import Optional, List
from app.schemas.company import CompanySchema, DataSharingPolicySchema
from app.repositories.company import CompanyRepository, DataSharingPolicyRepository

# Table names for Supabase
COMPANY_RELATIONSHIPS_TABLE = 'company_relationships'
DATA_SHARING_THIRD_PARTIES_TABLE = 'data_sharing_third_parties'

class Company:
    """Company model for organizations in the system."""
    
    def __init__(self, schema: CompanySchema):
        self._schema = schema
        self._repository = CompanyRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def name(self) -> str:
        return self._schema.name
    
    @property
    def logo(self) -> Optional[str]:
        return self._schema.logo
    
    @property
    def industry(self) -> Optional[str]:
        return self._schema.industry
    
    @property
    def website(self) -> Optional[str]:
        return self._schema.website
    
    @property
    def description(self) -> Optional[str]:
        return self._schema.description
    
    @property
    def size_range(self) -> Optional[str]:
        return self._schema.size_range
    
    @property
    def city(self) -> Optional[str]:
        return self._schema.city
    
    @property
    def state(self) -> Optional[str]:
        return self._schema.state
    
    @property
    def country(self) -> Optional[str]:
        return self._schema.country
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['Company']:
        """Find a company by ID."""
        schema = await CompanyRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['Company']:
        """Get all companies."""
        schemas = await CompanyRepository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> 'Company':
        """Save the company."""
        if self.id:
            self._schema = await self._repository.update(self._schema)
        else:
            self._schema = await self._repository.create(self._schema)
        return self
    
    async def delete(self) -> bool:
        """Delete the company."""
        if self.id:
            return await self._repository.delete(self.id)
        return False
    
    async def get_related_companies(self) -> List['Company']:
        """Get companies related to this company."""
        if not self.id:
            return []
        schemas = await self._repository.get_related_companies(self.id)
        return [Company(schema) for schema in schemas]
    
    def to_dict(self):
        """Convert company to dictionary for API response."""
        return self._schema.to_dict()

class DataSharingPolicy:
    """Data sharing policy for a company."""
    
    def __init__(self, schema: DataSharingPolicySchema):
        self.schema = schema
        self._repository = DataSharingPolicyRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self.schema.id
    
    @property
    def company_id(self) -> int:
        return self.schema.company_id
    
    @property
    def data_type_id(self) -> int:
        return self.schema.data_type_id
    
    @property
    def purpose(self) -> str:
        return self.schema.purpose
    
    @property
    def description(self) -> Optional[str]:
        return self.schema.description
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['DataSharingPolicy']:
        """Find a policy by ID."""
        schema = await DataSharingPolicyRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_company_policies(cls, company_id: int) -> List['DataSharingPolicy']:
        """Get all policies for a company."""
        schemas = await DataSharingPolicyRepository.get_company_policies(company_id)
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> 'DataSharingPolicy':
        """Save the policy."""
        if self.id:
            self.schema = await self._repository.update(self.schema)
        else:
            self.schema = await self._repository.create(self.schema)
        return self
    
    async def delete(self) -> bool:
        """Delete the policy."""
        if self.id:
            return await self._repository.delete(self.id)
        return False
    
    def to_dict(self):
        """Convert policy to dictionary for API response."""
        return self.schema.to_dict()

# Table name for the many-to-many relationship between data sharing policies and third party companies
DATA_SHARING_THIRD_PARTIES_TABLE = 'data_sharing_third_parties' 