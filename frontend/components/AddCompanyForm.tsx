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
    <div className="neu-flat-contrast p-6 border-t-4 border-primary-500">
      <h3 className="text-xl font-bold text-primary-800 mb-6 pb-2 border-b-2 border-primary-300">Add Company Manually</h3>
      
      {error && (
        <div className="p-4 mb-4 neu-concave bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500" role="alert">
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-primary-800 font-semibold mb-2">Company Name *</label>
          <input 
            type="text" 
            className="neu-input-contrast" 
            id="name" 
            name="name" 
            value={company.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="industry" className="block text-primary-800 font-semibold mb-2">Industry</label>
          <input 
            type="text" 
            className="neu-input-contrast" 
            id="industry" 
            name="industry" 
            value={company.industry || ''} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="website" className="block text-primary-800 font-semibold mb-2">Website</label>
          <input 
            type="url" 
            className="neu-input-contrast" 
            id="website" 
            name="website" 
            value={company.website || ''} 
            onChange={handleChange} 
            placeholder="https://example.com" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-primary-800 font-semibold mb-2">Description</label>
          <textarea 
            className="neu-input-contrast resize-none" 
            id="description" 
            name="description" 
            value={company.description || ''} 
            onChange={handleChange} 
            rows={3} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="size_range" className="block text-primary-800 font-semibold mb-2">Company Size</label>
            <select 
              className="neu-input-contrast" 
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
            <label htmlFor="country" className="block text-primary-800 font-semibold mb-2">Country</label>
            <input 
              type="text" 
              className="neu-input-contrast" 
              id="country" 
              name="country" 
              value={company.country || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-primary-800 font-semibold mb-2">City</label>
            <input 
              type="text" 
              className="neu-input-contrast" 
              id="city" 
              name="city" 
              value={company.city || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-primary-800 font-semibold mb-2">State/Province</label>
            <input 
              type="text" 
              className="neu-input-contrast" 
              id="state" 
              name="state" 
              value={company.state || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="logo" className="block text-primary-800 font-semibold mb-2">Logo URL</label>
          <input 
            type="url" 
            className="neu-input-contrast" 
            id="logo" 
            name="logo" 
            value={company.logo || ''} 
            onChange={handleChange} 
            placeholder="https://example.com/logo.png" 
          />
        </div>
        
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t-2 border-primary-300">
          <button 
            type="button" 
            className="neu-button bg-primary-50 text-primary-700 border border-primary-300" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="neu-button-contrast" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" role="status" aria-hidden="true"></span>
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