from datetime import datetime
from app import db

class DataSharingTerm(db.Model):
    __tablename__ = 'data_sharing_terms'
    
    term_id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    data_type = db.Column(db.String(50), nullable=False)
    terms = db.Column(db.Text, nullable=False)
    accepted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Add a unique constraint across company, user, and data_type
    __table_args__ = (
        db.UniqueConstraint('company_id', 'user_id', 'data_type', name='_company_user_data_type_uc'),
    )
    
    def __init__(self, company_id, user_id, data_type, terms):
        self.company_id = company_id
        self.user_id = user_id
        self.data_type = data_type
        self.terms = terms
    
    def to_dict(self):
        """Convert data sharing term to dictionary for API responses"""
        return {
            'term_id': self.term_id,
            'company_id': self.company_id,
            'user_id': self.user_id,
            'data_type': self.data_type,
            'terms': self.terms,
            'accepted_at': self.accepted_at.isoformat()
        }
    
    def __repr__(self):
        return f'<DataSharingTerm {self.company_id}:{self.user_id}:{self.data_type}>' 