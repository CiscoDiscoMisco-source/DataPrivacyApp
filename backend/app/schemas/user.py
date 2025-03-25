from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserSchema(BaseModel):
    """Schema for user data."""
    id: Optional[int] = None
    email: EmailStr
    password_hash: str
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    is_admin: bool = False
    tokens: int = Field(default=0, ge=0)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenPackageSchema(BaseModel):
    """Schema for token package data."""
    id: Optional[int] = None
    name: str = Field(..., min_length=1)
    amount: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 