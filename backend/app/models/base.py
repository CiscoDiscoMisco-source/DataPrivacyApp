"""
Base model module defining common functionality for all database models.
"""
from app import db
from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr

class BaseModel(db.Model):
    """
    Abstract base model for all database models.
    Provides common functionality and attributes.
    """
    __abstract__ = True
    
    @declared_attr
    def __tablename__(cls):
        # Generate table name from class name (converts CamelCase to snake_case)
        # User -> users, DataType -> data_types
        name = cls.__name__
        return ''.join(['_' + c.lower() if c.isupper() else c for c in name]).lstrip('_') + 's'
    
    # Add common methods
    def save(self):
        """Save the model instance to the database."""
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        """Delete the model instance from the database."""
        db.session.delete(self)
        db.session.commit()
    
    @classmethod
    def get_by_id(cls, id_value):
        """Get a model instance by its primary key."""
        return cls.query.get(id_value)
    
    @classmethod
    def get_all(cls):
        """Get all instances of the model."""
        return cls.query.all()

class TimestampMixin:
    """Mixin to add created_at and updated_at timestamps to models."""
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False) 