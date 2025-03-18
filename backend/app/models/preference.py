from datetime import datetime
from app import db

class Preference(db.Model):
    __tablename__ = 'preferences'
    
    preference_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)  # NULL for global preferences
    data_type = db.Column(db.String(50), nullable=False)
    allowed = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Add a unique constraint across user, company, and data_type
    __table_args__ = (
        db.UniqueConstraint('user_id', 'company_id', 'data_type', name='_user_company_data_type_uc'),
    )
    
    def __init__(self, user_id, data_type, allowed=False, company_id=None):
        self.user_id = user_id
        self.data_type = data_type
        self.allowed = allowed
        self.company_id = company_id
    
    def is_global(self):
        """Check if this is a global preference (applies to all companies)"""
        return self.company_id is None
    
    def to_dict(self):
        """Convert preference to dictionary for API responses"""
        return {
            'preference_id': self.preference_id,
            'user_id': self.user_id,
            'company_id': self.company_id,
            'data_type': self.data_type,
            'allowed': self.allowed,
            'updated_at': self.updated_at.isoformat(),
            'is_global': self.is_global()
        }
    
    def __repr__(self):
        scope = "global" if self.is_global() else f"company:{self.company_id}"
        return f'<Preference {self.user_id}:{scope}:{self.data_type}>' 