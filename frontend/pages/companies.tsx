import React, { useState } from 'react';
import { NextPage } from 'next';
import CompaniesPage from '../components/CompaniesPage';
import Layout from '../components/Layout';

const CompaniesPageWrapper: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <Layout title="Companies | Data Privacy App">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <CompaniesPage searchTerm={searchTerm} />
    </Layout>
  );
};

export default CompaniesPageWrapper; 