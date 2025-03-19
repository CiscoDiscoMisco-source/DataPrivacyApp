import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CompanyNetwork from '../components/CompanyNetwork';
import { useCompanyDetail } from '../hooks/useCompanyDetail';
import CompanyTerms from '../components/company/CompanyTerms';
import CompanyPreferences from '../components/company/CompanyPreferences';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const { 
    company,
    companies,
    terms,
    preferences,
    loading,
    error,
    handlePreferenceToggle,
    handleClonePreferences
  } = useCompanyDetail(companyId);

  if (loading) {
    return <div className="alert alert-info">Loading company details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!company) {
    return <div className="alert alert-warning">Company not found</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{company.name}</h1>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Company Information</h3>
            </div>
            <div className="card-body">
              <p><strong>Domain:</strong> {company.domain}</p>
              {company.description && (
                <p><strong>Description:</strong> {company.description}</p>
              )}
            </div>
          </div>
          
          <CompanyTerms terms={terms} />
        </div>
        
        <div className="col-md-6">
          <CompanyPreferences 
            preferences={preferences}
            companies={companies}
            currentCompanyId={companyId}
            onTogglePreference={handlePreferenceToggle}
            onClonePreferences={handleClonePreferences}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <CompanyNetwork 
          companies={companies} 
          selectedCompany={companyId}
          preferences={preferences}
        />
      </div>
    </div>
  );
};

export default CompanyDetail; 