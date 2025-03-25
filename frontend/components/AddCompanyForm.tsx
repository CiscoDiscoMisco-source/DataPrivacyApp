import React, { useState } from 'react';
import ApiService from '../services/api';

interface Company {
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  description?: string;
  size_range?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AddCompanyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onSuccess, onCancel }) => {
  const [company, setCompany] = useState<Company>({
    name: '',
    logo: '',
    industry: '',
    website: '',
    description: '',
    size_range: '',
    city: '',
    state: '',
    country: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!company.name.trim()) {
      setError('Company name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.post('/companies', company);
      console.log('Company added:', response);
      
      // Call success callback to refresh list
      onSuccess();
    } catch (err: any) {
      console.error('Failed to add company:', err);
      setError(err.message || 'Failed to add company. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="add-company-form p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4">Add Company Manually</h3>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Company Name *</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            name="name" 
            value={company.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="industry" className="form-label">Industry</label>
          <input 
            type="text" 
            className="form-control" 
            id="industry" 
            name="industry" 
            value={company.industry || ''} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="website" className="form-label">Website</label>
          <input 
            type="url" 
            className="form-control" 
            id="website" 
            name="website" 
            value={company.website || ''} 
            onChange={handleChange} 
            placeholder="https://example.com" 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            className="form-control" 
            id="description" 
            name="description" 
            value={company.description || ''} 
            onChange={handleChange} 
            rows={3} 
          />
        </div>
        
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="size_range" className="form-label">Company Size</label>
            <select 
              className="form-select" 
              id="size_range" 
              name="size_range" 
              value={company.size_range || ''} 
              onChange={handleChange}
            >
              <option value="">Select size range</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1001-5000">1001-5000 employees</option>
              <option value="5001+">5001+ employees</option>
            </select>
          </div>
          
          <div className="col">
            <label htmlFor="country" className="form-label">Country</label>
            <input 
              type="text" 
              className="form-control" 
              id="country" 
              name="country" 
              value={company.country || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="city" className="form-label">City</label>
            <input 
              type="text" 
              className="form-control" 
              id="city" 
              name="city" 
              value={company.city || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="col">
            <label htmlFor="state" className="form-label">State/Province</label>
            <input 
              type="text" 
              className="form-control" 
              id="state" 
              name="state" 
              value={company.state || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">Logo URL</label>
          <input 
            type="url" 
            className="form-control" 
            id="logo" 
            name="logo" 
            value={company.logo || ''} 
            onChange={handleChange} 
            placeholder="https://example.com/logo.png" 
          />
        </div>
        
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : 'Add Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm; 