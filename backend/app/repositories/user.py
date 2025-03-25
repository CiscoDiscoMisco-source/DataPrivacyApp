from typing import Optional, List, Dict, Any
from app.db import get_supabase
from app.schemas.user import UserSchema, TokenPackageSchema

class UserRepository:
    """Repository for user-related database operations."""
    
    @staticmethod
    async def find_by_id(id: int) -> Optional[UserSchema]:
        """Find a user by ID."""
        supabase = get_supabase()
        response = supabase.table('users').select('*').eq('id', id).execute()
        if response.data:
            return UserSchema.from_dict(response.data[0])
        return None
    
    @staticmethod
    async def find_by_email(email: str) -> Optional[UserSchema]:
        """Find a user by email."""
        supabase = get_supabase()
        response = supabase.table('users').select('*').eq('email', email).execute()
        if response.data:
            return UserSchema.from_dict(response.data[0])
        return None
    
    @staticmethod
    async def get_all() -> List[UserSchema]:
        """Get all users."""
        supabase = get_supabase()
        response = supabase.table('users').select('*').execute()
        return [UserSchema.from_dict(item) for item in response.data]
    
    @staticmethod
    async def create(user: UserSchema) -> UserSchema:
        """Create a new user."""
        supabase = get_supabase()
        response = supabase.table('users').insert(user.to_dict()).execute()
        return UserSchema.from_dict(response.data[0])
    
    @staticmethod
    async def update(user: UserSchema) -> UserSchema:
        """Update an existing user."""
        supabase = get_supabase()
        response = supabase.table('users').update(user.to_dict()).eq('id', user.id).execute()
        return UserSchema.from_dict(response.data[0])
    
    @staticmethod
    async def delete(id: int) -> bool:
        """Delete a user."""
        supabase = get_supabase()
        response = supabase.table('users').delete().eq('id', id).execute()
        return bool(response.data)
    
    @staticmethod
    async def update_tokens(user_id: int, new_token_count: int) -> Optional[UserSchema]:
        """Update user's token count."""
        supabase = get_supabase()
        response = supabase.table('users').update({'tokens': new_token_count}).eq('id', user_id).execute()
        if response.data:
            return UserSchema.from_dict(response.data[0])
        return None

class TokenPackageRepository:
    """Repository for token package operations."""
    
    @staticmethod
    async def find_by_id(id: int) -> Optional[TokenPackageSchema]:
        """Find a token package by ID."""
        supabase = get_supabase()
        response = supabase.table('token_packages').select('*').eq('id', id).execute()
        if response.data:
            return TokenPackageSchema.from_dict(response.data[0])
        return None
    
    @staticmethod
    async def get_all() -> List[TokenPackageSchema]:
        """Get all token packages."""
        supabase = get_supabase()
        response = supabase.table('token_packages').select('*').execute()
        return [TokenPackageSchema.from_dict(item) for item in response.data]
    
    @staticmethod
    async def create(package: TokenPackageSchema) -> TokenPackageSchema:
        """Create a new token package."""
        supabase = get_supabase()
        response = supabase.table('token_packages').insert(package.to_dict()).execute()
        return TokenPackageSchema.from_dict(response.data[0])
    
    @staticmethod
    async def update(package: TokenPackageSchema) -> TokenPackageSchema:
        """Update an existing token package."""
        supabase = get_supabase()
        response = supabase.table('token_packages').update(package.to_dict()).eq('id', package.id).execute()
        return TokenPackageSchema.from_dict(response.data[0])
    
    @staticmethod
    async def delete(id: int) -> bool:
        """Delete a token package."""
        supabase = get_supabase()
        response = supabase.table('token_packages').delete().eq('id', id).execute()
        return bool(response.data) 