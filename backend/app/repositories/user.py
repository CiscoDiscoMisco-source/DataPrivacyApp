from typing import Optional, List, Dict, Any
from app.db import get_supabase
from app.schemas.user import UserSchema, TokenPackageSchema
from supabase import Client
from postgrest.exceptions import APIError

class UserRepository:
    """Repository for user-related database operations."""
    
    def __init__(self, supabase: Optional[Client] = None):
        self.supabase = supabase or get_supabase()
    
    async def find_by_id(self, id: int) -> Optional[UserSchema]:
        """Find a user by ID."""
        try:
            response = self.supabase.table('users').select('*').eq('id', id).single().execute()
            return UserSchema.model_validate(response.data)
        except APIError:
            return None
    
    async def find_by_email(self, email: str) -> Optional[UserSchema]:
        """Find a user by email."""
        try:
            response = self.supabase.table('users').select('*').eq('email', email).single().execute()
            return UserSchema.model_validate(response.data)
        except APIError:
            return None
    
    async def get_all(self) -> List[UserSchema]:
        """Get all users."""
        try:
            response = self.supabase.table('users').select('*').execute()
            return [UserSchema.model_validate(item) for item in response.data]
        except APIError:
            return []
    
    async def create(self, user: UserSchema) -> Optional[UserSchema]:
        """Create a new user."""
        try:
            response = self.supabase.table('users').insert(user.model_dump(exclude={'id'})).execute()
            return UserSchema.model_validate(response.data[0])
        except APIError:
            return None
    
    async def update(self, user: UserSchema) -> Optional[UserSchema]:
        """Update an existing user."""
        if not user.id:
            return None
        try:
            response = self.supabase.table('users').update(
                user.model_dump(exclude={'id', 'created_at'})
            ).eq('id', user.id).execute()
            return UserSchema.model_validate(response.data[0])
        except APIError:
            return None
    
    async def delete(self, id: int) -> bool:
        """Delete a user."""
        try:
            response = self.supabase.table('users').delete().eq('id', id).execute()
            return bool(response.data)
        except APIError:
            return False
    
    async def update_tokens(self, user_id: int, new_token_count: int) -> Optional[UserSchema]:
        """Update user's token count."""
        try:
            response = self.supabase.table('users').update(
                {'tokens': new_token_count}
            ).eq('id', user_id).execute()
            return UserSchema.model_validate(response.data[0])
        except APIError:
            return None

class TokenPackageRepository:
    """Repository for token package operations."""
    
    def __init__(self, supabase: Optional[Client] = None):
        self.supabase = supabase or get_supabase()
    
    async def find_by_id(self, id: int) -> Optional[TokenPackageSchema]:
        """Find a token package by ID."""
        try:
            response = self.supabase.table('token_packages').select('*').eq('id', id).single().execute()
            return TokenPackageSchema.model_validate(response.data)
        except APIError:
            return None
    
    async def get_all(self) -> List[TokenPackageSchema]:
        """Get all token packages."""
        try:
            response = self.supabase.table('token_packages').select('*').execute()
            return [TokenPackageSchema.model_validate(item) for item in response.data]
        except APIError:
            return []
    
    async def create(self, package: TokenPackageSchema) -> Optional[TokenPackageSchema]:
        """Create a new token package."""
        try:
            response = self.supabase.table('token_packages').insert(
                package.model_dump(exclude={'id'})
            ).execute()
            return TokenPackageSchema.model_validate(response.data[0])
        except APIError:
            return None
    
    async def update(self, package: TokenPackageSchema) -> Optional[TokenPackageSchema]:
        """Update an existing token package."""
        if not package.id:
            return None
        try:
            response = self.supabase.table('token_packages').update(
                package.model_dump(exclude={'id', 'created_at'})
            ).eq('id', package.id).execute()
            return TokenPackageSchema.model_validate(response.data[0])
        except APIError:
            return None
    
    async def delete(self, id: int) -> bool:
        """Delete a token package."""
        try:
            response = self.supabase.table('token_packages').delete().eq('id', id).execute()
            return bool(response.data)
        except APIError:
            return False 