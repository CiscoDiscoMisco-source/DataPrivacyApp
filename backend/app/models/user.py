from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserSchema, TokenPackageSchema
from app.repositories.user import UserRepository, TokenPackageRepository
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    """User model with business logic."""
    
    def __init__(self, schema: UserSchema):
        self._schema = schema
        self._repository = UserRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def email(self) -> str:
        return self._schema.email
    
    @property
    def first_name(self) -> str:
        return self._schema.first_name
    
    @property
    def last_name(self) -> str:
        return self._schema.last_name
    
    @property
    def is_admin(self) -> bool:
        return self._schema.is_admin
    
    @property
    def tokens(self) -> int:
        return self._schema.tokens
    
    @property
    def created_at(self) -> datetime:
        return self._schema.created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._schema.updated_at
    
    def set_password(self, password: str) -> None:
        """Set the user's password hash."""
        self._schema.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the hash."""
        return check_password_hash(self._schema.password_hash, password)
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['User']:
        """Find a user by ID."""
        repository = UserRepository()
        schema = await repository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def find_by_email(cls, email: str) -> Optional['User']:
        """Find a user by email."""
        repository = UserRepository()
        schema = await repository.find_by_email(email)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['User']:
        """Get all users."""
        repository = UserRepository()
        schemas = await repository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> bool:
        """Save the user to the database."""
        if self.id:
            updated = await self._repository.update(self._schema)
        else:
            updated = await self._repository.create(self._schema)
        return bool(updated)
    
    async def delete(self) -> bool:
        """Delete the user from the database."""
        if not self.id:
            return False
        return await self._repository.delete(self.id)
    
    async def update_tokens(self, new_token_count: int) -> bool:
        """Update the user's token count."""
        if not self.id:
            return False
        updated = await self._repository.update_tokens(self.id, new_token_count)
        if updated:
            self._schema.tokens = new_token_count
        return bool(updated)

class TokenPackage:
    """Token package model with business logic."""
    
    def __init__(self, schema: TokenPackageSchema):
        self._schema = schema
        self._repository = TokenPackageRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self._schema.id
    
    @property
    def name(self) -> str:
        return self._schema.name
    
    @property
    def amount(self) -> int:
        return self._schema.amount
    
    @property
    def price(self) -> float:
        return self._schema.price
    
    @property
    def description(self) -> str:
        return self._schema.description
    
    @property
    def created_at(self) -> datetime:
        return self._schema.created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._schema.updated_at
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['TokenPackage']:
        """Find a token package by ID."""
        repository = TokenPackageRepository()
        schema = await repository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['TokenPackage']:
        """Get all token packages."""
        repository = TokenPackageRepository()
        schemas = await repository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> bool:
        """Save the token package to the database."""
        if self.id:
            updated = await self._repository.update(self._schema)
        else:
            updated = await self._repository.create(self._schema)
        return bool(updated)
    
    async def delete(self) -> bool:
        """Delete the token package from the database."""
        if not self.id:
            return False
        return await self._repository.delete(self.id) 