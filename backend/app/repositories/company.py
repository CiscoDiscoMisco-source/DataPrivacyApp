from typing import Optional, List, Dict, Any
from app.db import get_supabase
from app.schemas.company import CompanySchema, DataSharingPolicySchema

class CompanyRepository:
    """Repository for company-related database operations."""
    
    @staticmethod
    async def find_by_id(id: int) -> Optional[CompanySchema]:
        """Find a company by ID."""
        supabase = get_supabase()
        response = supabase.table('companies').select('*').eq('id', id).execute()
        if response.data:
            return CompanySchema.from_dict(response.data[0])
        return None
    
    @staticmethod
    async def get_all() -> List[CompanySchema]:
        """Get all companies."""
        supabase = get_supabase()
        response = supabase.table('companies').select('*').execute()
        return [CompanySchema.from_dict(item) for item in response.data]
    
    @staticmethod
    async def create(company: CompanySchema) -> CompanySchema:
        """Create a new company."""
        supabase = get_supabase()
        response = supabase.table('companies').insert(company.to_dict()).execute()
        return CompanySchema.from_dict(response.data[0])
    
    @staticmethod
    async def update(company: CompanySchema) -> CompanySchema:
        """Update an existing company."""
        supabase = get_supabase()
        response = supabase.table('companies').update(company.to_dict()).eq('id', company.id).execute()
        return CompanySchema.from_dict(response.data[0])
    
    @staticmethod
    async def delete(id: int) -> bool:
        """Delete a company."""
        supabase = get_supabase()
        response = supabase.table('companies').delete().eq('id', id).execute()
        return bool(response.data)
    
    @staticmethod
    async def get_related_companies(company_id: int) -> List[CompanySchema]:
        """Get companies related to a specific company."""
        supabase = get_supabase()
        response = supabase.table('company_relationships').select(
            'target_company:companies(*)'
        ).eq('source_company_id', company_id).execute()
        return [CompanySchema.from_dict(item['target_company']) for item in response.data]

class DataSharingPolicyRepository:
    """Repository for data sharing policy operations."""
    
    @staticmethod
    async def find_by_id(id: int) -> Optional[DataSharingPolicySchema]:
        """Find a policy by ID."""
        supabase = get_supabase()
        response = supabase.table('data_sharing_policies').select('*').eq('id', id).execute()
        if response.data:
            return DataSharingPolicySchema.from_dict(response.data[0])
        return None
    
    @staticmethod
    async def get_company_policies(company_id: int) -> List[DataSharingPolicySchema]:
        """Get all policies for a company."""
        supabase = get_supabase()
        response = supabase.table('data_sharing_policies').select('*').eq('company_id', company_id).execute()
        return [DataSharingPolicySchema.from_dict(item) for item in response.data]
    
    @staticmethod
    async def create(policy: DataSharingPolicySchema) -> DataSharingPolicySchema:
        """Create a new policy."""
        supabase = get_supabase()
        response = supabase.table('data_sharing_policies').insert(policy.to_dict()).execute()
        return DataSharingPolicySchema.from_dict(response.data[0])
    
    @staticmethod
    async def update(policy: DataSharingPolicySchema) -> DataSharingPolicySchema:
        """Update an existing policy."""
        supabase = get_supabase()
        response = supabase.table('data_sharing_policies').update(policy.to_dict()).eq('id', policy.id).execute()
        return DataSharingPolicySchema.from_dict(response.data[0])
    
    @staticmethod
    async def delete(id: int) -> bool:
        """Delete a policy."""
        supabase = get_supabase()
        response = supabase.table('data_sharing_policies').delete().eq('id', id).execute()
        return bool(response.data) 