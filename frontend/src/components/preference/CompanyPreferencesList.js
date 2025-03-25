import React from 'react';

const CompanyPreferencesList = () => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Company-Specific Preferences</h3>
      <p className="text-gray-600 mb-4">You have set custom preferences for the following companies:</p>
      
      <div className="space-y-2">
        <a 
          href="#" 
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Acme Corporation</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Custom</span>
          </div>
        </a>
        
        <a 
          href="#" 
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Tech Innovations Inc</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Custom</span>
          </div>
        </a>
        
        <a 
          href="#" 
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Global Data Systems</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Custom</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default CompanyPreferencesList; 