import React from 'react';

const CompanyTerms = ({ terms }) => {
  if (!terms || terms.length === 0) {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h3>Data Sharing Terms</h3>
        </div>
        <div className="card-body">
          <p className="text-muted">No data sharing terms available for this company.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Data Sharing Terms</h3>
      </div>
      <div className="card-body">
        <div className="accordion" id="termAccordion">
          {terms.map((term, index) => (
            <div className="accordion-item" key={term.term_id || index}>
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#term-${index}`}
                >
                  {term.data_type}
                </button>
              </h2>
              <div 
                id={`term-${index}`} 
                className="accordion-collapse collapse"
                data-bs-parent="#termAccordion"
              >
                <div className="accordion-body">
                  <p>{term.terms}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyTerms; 