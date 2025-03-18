from app import db

class Company(db.Model):
    __tablename__ = 'companies'
    
    company_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    domain = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Relationships
    data_sharing_terms = db.relationship('DataSharingTerm', backref='company', lazy='dynamic')
    preferences = db.relationship('Preference', backref='company', lazy='dynamic')
    
    def __init__(self, name, domain, description=None):
        self.name = name
        self.domain = domain
        self.description = description
    
    def to_dict(self):
        """Convert company to dictionary for API responses"""
        return {
            'company_id': self.company_id,
            'name': self.name,
            'domain': self.domain,
            'description': self.description
        }
    
    def to_search_dict(self):
        """Convert company to dictionary for Elasticsearch indexing"""
        return {
            'company_id': self.company_id,
            'name': self.name,
            'domain': self.domain
        }
    
    def __repr__(self):
        return f'<Company {self.name}>' 