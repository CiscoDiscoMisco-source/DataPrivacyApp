import React, { useState } from 'react';
import ApiService from '../services/api';
import { Company, CompanyInput } from '../types';

interface AddCompanyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onSuccess, onCancel }) => {
  const [company, setCompany] = useState<CompanyInput>({
    name: '',
    logo: '',
    industry: '',
    website: '',
    description: '',
    size_range: '',
    city: '',
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
      
      // Clean up the data before sending
      const cleanCompany = {
        ...company,
        name: company.name.trim(),
        website: company.website?.trim() || null,
        logo: company.logo?.trim() || null,
        industry: company.industry?.trim() || null,
        description: company.description?.trim() || null,
        size_range: company.size_range || null,
        city: company.city?.trim() || null,
        country: company.country?.trim() || null
      };
      
      const response = await ApiService.post('/companies', cleanCompany);
      console.log('Company added:', response);
      
      // Call success callback to refresh list
      onSuccess();
    } catch (err: any) {
      console.error('Failed to add company:', err);
      // Handle specific error cases
      if (err.message?.includes('409')) {
        setError('A company with this name already exists');
      } else if (err.message?.includes('403')) {
        setError('You do not have permission to create companies');
      } else if (err.message?.includes('401')) {
        setError('Please log in to create companies');
      } else {
        setError(err.message || 'Failed to add company. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="glass-container">
      <h3 className="glass-heading text-xl mb-6">Add Company Manually</h3>
      
      {error && (
        <div className="glass-container bg-red-500/20 border-red-500/50 p-4 mb-4" role="alert">
          <span className="font-medium text-red-100">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="glass-text block font-semibold mb-2">Company Name *</label>
          <input 
            type="text" 
            className="glass-input" 
            id="name" 
            name="name" 
            value={company.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="glass-text block font-semibold mb-2">Industry</label>
          <input 
            type="text" 
            className="glass-input" 
            id="industry" 
            name="industry" 
            value={company.industry || ''} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <label htmlFor="website" className="glass-text block font-semibold mb-2">Website</label>
          <input 
            type="url" 
            className="glass-input" 
            id="website" 
            name="website" 
            value={company.website || ''} 
            onChange={handleChange} 
            placeholder="https://example.com" 
          />
        </div>
        
        <div>
          <label htmlFor="description" className="glass-text block font-semibold mb-2">Description</label>
          <textarea 
            className="glass-input resize-none" 
            id="description" 
            name="description" 
            value={company.description || ''} 
            onChange={handleChange} 
            rows={3} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="size_range" className="glass-text block font-semibold mb-2">Company Size</label>
            <select 
              className="glass-input" 
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
          
          <div>
            <label htmlFor="country" className="glass-text block font-semibold mb-2">Country</label>
            <input 
              type="text" 
              className="glass-input" 
              id="country" 
              name="country" 
              value={company.country || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="city" className="glass-text block font-semibold mb-2">City</label>
          <input 
            type="text" 
            className="glass-input" 
            id="city" 
            name="city" 
            value={company.city || ''} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <label htmlFor="logo" className="glass-text block font-semibold mb-2">Logo URL</label>
          <input 
            type="url" 
            className="glass-input" 
            id="logo" 
            name="logo" 
            value={company.logo || ''} 
            onChange={handleChange} 
            placeholder="https://example.com/logo.png" 
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-6 border-t border-primary-glow/20">
          <button 
            type="button" 
            className="glass-button" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="glass-button" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-primary-light border-t-transparent rounded-full" role="status" aria-hidden="true"></span>
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