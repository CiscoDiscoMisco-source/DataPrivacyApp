"""
DataSharingTerm model module defining the DataSharingTerm database model and related functionality.
"""
from datetime import datetime, timedelta
from app import db
from app.models.base import BaseModel, TimestampMixin
from enum import Enum

class SharingStatus(Enum):
    """Enumeration of possible sharing statuses."""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"
    TERMINATED = "terminated"

class DataSharingTerm(BaseModel, TimestampMixin):
    """
    DataSharingTerm model representing data sharing agreements between companies.
    Defines the terms and conditions for sharing specific data types.
    """
    __tablename__ = 'data_sharing_terms'
    
    id = db.Column(db.Integer, primary_key=True)
    purpose = db.Column(db.Text, nullable=False)
    duration = db.Column(db.Integer)  # in days
    conditions = db.Column(db.JSON)  # Store conditions as JSON
    status = db.Column(db.Enum(SharingStatus), default=SharingStatus.PENDING)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    termination_reason = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    # Foreign Keys
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    data_type_id = db.Column(db.Integer, db.ForeignKey('data_types.id'), nullable=False)
    shared_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shared_with_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __init__(self, purpose, company_id, data_type_id, shared_by_id, shared_with_id, **kwargs):
        """
        Initialize a new DataSharingTerm instance.
        
        Args:
            purpose (str): Purpose of data sharing
            company_id (int): ID of the company sharing the data
            data_type_id (int): ID of the data type being shared
            shared_by_id (int): ID of the user sharing the data
            shared_with_id (int): ID of the user receiving the data
            **kwargs: Additional keyword arguments
        """
        super().__init__(**kwargs)
        self.purpose = purpose.strip()
        self.company_id = company_id
        self.data_type_id = data_type_id
        self.shared_by_id = shared_by_id
        self.shared_with_id = shared_with_id
    
    def set_conditions(self, conditions):
        """
        Set conditions for data sharing.
        
        Args:
            conditions (dict): Dictionary containing sharing conditions
        """
        if not isinstance(conditions, dict):
            raise ValueError("Conditions must be a dictionary")
        
        # Validate required fields in conditions
        required_fields = {'data_usage', 'security_measures', 'retention_period'}
        if not all(field in conditions for field in required_fields):
            raise ValueError("Conditions missing required fields")
        
        self.conditions = conditions
    
    def accept(self):
        """Accept the data sharing terms."""
        if self.status != SharingStatus.PENDING:
            raise ValueError("Only pending terms can be accepted")
        
        self.status = SharingStatus.ACCEPTED
        self.start_date = datetime.utcnow()
        if self.duration:
            self.end_date = self.start_date + timedelta(days=self.duration)
    
    def reject(self):
        """Reject the data sharing terms."""
        if self.status != SharingStatus.PENDING:
            raise ValueError("Only pending terms can be rejected")
        
        self.status = SharingStatus.REJECTED
    
    def terminate(self, reason):
        """
        Terminate the data sharing agreement.
        
        Args:
            reason (str): Reason for termination
        """
        if self.status not in [SharingStatus.ACCEPTED, SharingStatus.PENDING]:
            raise ValueError("Only accepted or pending terms can be terminated")
        
        self.status = SharingStatus.TERMINATED
        self.termination_reason = reason.strip()
        self.end_date = datetime.utcnow()
    
    def is_expired(self):
        """
        Check if the sharing terms have expired.
        
        Returns:
            bool: True if terms have expired, False otherwise
        """
        if not self.end_date:
            return False
        return datetime.utcnow() > self.end_date
    
    def to_dict(self):
        """
        Convert data sharing terms to dictionary representation.
        
        Returns:
            dict: Data sharing terms data as dictionary
        """
        return {
            'id': self.id,
            'purpose': self.purpose,
            'duration': self.duration,
            'conditions': self.conditions,
            'status': self.status.value,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'termination_reason': self.termination_reason,
            'is_active': self.is_active,
            'company_id': self.company_id,
            'data_type_id': self.data_type_id,
            'shared_by_id': self.shared_by_id,
            'shared_with_id': self.shared_with_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        """String representation of the DataSharingTerm model."""
        return f'<DataSharingTerm {self.id}>' 