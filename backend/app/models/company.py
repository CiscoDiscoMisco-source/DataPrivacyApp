from app import db
from .base import BaseModel

# Association table for many-to-many relationship between companies - using direct SQL table creation
# to avoid conflict with SQLAlchemy model inheritance
company_relationships = db.Table(
    'company_relationships',
    db.Column('source_company_id', db.String(36), db.ForeignKey('companies.id', name='company_relationships_source_company_id_fkey'), primary_key=True),
    db.Column('target_company_id', db.String(36), db.ForeignKey('companies.id', name='company_relationships_target_company_id_fkey'), primary_key=True),
    db.Column('relationship_type', db.String(50))
)

class Company(BaseModel):
    """Company model for organizations in the system."""
    __tablename__ = 'companies'
    
    name = db.Column(db.String(255), unique=True, nullable=False)
    logo = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    website = db.Column(db.String(255))
    description = db.Column(db.Text)
    size_range = db.Column(db.String(50))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    
    # Relationships
    data_sharing_policies = db.relationship('DataSharingPolicy', backref='company', lazy='dynamic', cascade='all, delete-orphan')
    user_preferences = db.relationship('UserPreference', backref='company', lazy='dynamic', cascade='all, delete-orphan')
    
    # Many-to-many self-referential relationship for company data sharing
    related_companies = db.relationship(
        'Company', 
        secondary=company_relationships,
        primaryjoin=(company_relationships.c.source_company_id == id),
        secondaryjoin=(company_relationships.c.target_company_id == id),
        backref=db.backref('source_companies', lazy='dynamic'),
        lazy='dynamic'
    )
    
    def to_dict(self):
        """Convert company to dictionary for API response."""
        return {
            'id': self.id,
            'name': self.name,
            'logo': self.logo,
            'industry': self.industry,
            'website': self.website,
            'description': self.description,
            'size_range': self.size_range,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class DataSharingPolicy(BaseModel):
    """Data sharing policy for a company."""
    __tablename__ = 'data_sharing_policies'
    
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    data_type_id = db.Column(db.String(36), db.ForeignKey('data_types.id'), nullable=False)
    purpose = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Many-to-many relationship for third parties
    third_parties = db.relationship(
        'Company',
        secondary='data_sharing_third_parties',
        lazy='joined',
        backref=db.backref('shared_with_policies', lazy='dynamic')
    )
    
    def to_dict(self):
        """Convert data sharing policy to dictionary for API response."""
        return {
            'id': self.id,
            'company_id': self.company_id,
            'data_type_id': self.data_type_id,
            'purpose': self.purpose,
            'description': self.description,
            'third_parties': [company.to_dict() for company in self.third_parties],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Association table for many-to-many relationship between data sharing policies and third party companies
data_sharing_third_parties = db.Table('data_sharing_third_parties',
    db.Column('policy_id', db.String(36), db.ForeignKey('data_sharing_policies.id'), primary_key=True),
    db.Column('company_id', db.String(36), db.ForeignKey('companies.id'), primary_key=True)
) 