from datetime import datetime
from .user import db

class BaseModel(db.Model):
    """Base model with common attributes."""
    __abstract__ = True
    
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def save(self):
        """Save the model to the database."""
        db.session.add(self)
        db.session.commit()
        
    def delete(self):
        """Delete the model from the database."""
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_by_id(cls, id):
        """Find a model by ID."""
        return cls.query.get(id)
        
    @classmethod
    def get_all(cls):
        """Get all instances of the model."""
        return cls.query.all() 