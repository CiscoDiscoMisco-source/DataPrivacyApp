from typing import Optional, List
from flask_bcrypt import Bcrypt
from app.schemas.user import UserSchema, TokenPackageSchema
from app.repositories.user import UserRepository, TokenPackageRepository

bcrypt = Bcrypt()

class User:
    """User model for authentication and profile data."""
    
    def __init__(self, schema: UserSchema):
        self.schema = schema
        self._repository = UserRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self.schema.id
    
    @property
    def email(self) -> str:
        return self.schema.email
    
    @property
    def first_name(self) -> str:
        return self.schema.first_name
    
    @property
    def last_name(self) -> str:
        return self.schema.last_name
    
    @property
    def is_admin(self) -> bool:
        return self.schema.is_admin
    
    @property
    def tokens(self) -> int:
        return self.schema.tokens
    
    @property
    def password(self):
        """Prevent password from being accessed."""
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password: str):
        """Set password to a hashed password."""
        self.schema.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Check if hashed password matches actual password."""
        return bcrypt.check_password_hash(self.schema.password_hash, password)
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['User']:
        """Find a user by ID."""
        schema = await UserRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def find_by_email(cls, email: str) -> Optional['User']:
        """Find a user by email."""
        schema = await UserRepository.find_by_email(email)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['User']:
        """Get all users."""
        schemas = await UserRepository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> 'User':
        """Save the user."""
        if self.id:
            self.schema = await self._repository.update(self.schema)
        else:
            self.schema = await self._repository.create(self.schema)
        return self
    
    async def delete(self) -> bool:
        """Delete the user."""
        if self.id:
            return await self._repository.delete(self.id)
        return False
    
    async def update_tokens(self, new_token_count: int) -> bool:
        """Update user's token count."""
        if not self.id:
            return False
        updated_schema = await self._repository.update_tokens(self.id, new_token_count)
        if updated_schema:
            self.schema = updated_schema
            return True
        return False
    
    def to_dict(self):
        """Convert user to dictionary for API response."""
        return self.schema.to_dict()

class TokenPackage:
    """Token packages that users can purchase."""
    
    def __init__(self, schema: TokenPackageSchema):
        self.schema = schema
        self._repository = TokenPackageRepository()
    
    @property
    def id(self) -> Optional[int]:
        return self.schema.id
    
    @property
    def name(self) -> str:
        return self.schema.name
    
    @property
    def amount(self) -> int:
        return self.schema.amount
    
    @property
    def price(self) -> float:
        return self.schema.price
    
    @property
    def description(self) -> Optional[str]:
        return self.schema.description
    
    @classmethod
    async def find_by_id(cls, id: int) -> Optional['TokenPackage']:
        """Find a token package by ID."""
        schema = await TokenPackageRepository.find_by_id(id)
        return cls(schema) if schema else None
    
    @classmethod
    async def get_all(cls) -> List['TokenPackage']:
        """Get all token packages."""
        schemas = await TokenPackageRepository.get_all()
        return [cls(schema) for schema in schemas]
    
    async def save(self) -> 'TokenPackage':
        """Save the token package."""
        if self.id:
            self.schema = await self._repository.update(self.schema)
        else:
            self.schema = await self._repository.create(self.schema)
        return self
    
    async def delete(self) -> bool:
        """Delete the token package."""
        if self.id:
            return await self._repository.delete(self.id)
        return False
    
    def to_dict(self):
        """Convert token package to dictionary for API response."""
        return self.schema.to_dict() 