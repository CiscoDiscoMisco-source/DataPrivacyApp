import React from 'react';

const AccountSection = () => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Account Information</h3>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          id="fullName" 
          placeholder="Enter your full name" 
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          id="email" 
          placeholder="Enter your email" 
        />
      </div>
      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input 
          type="tel" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          id="phone" 
          placeholder="Enter your phone number" 
        />
      </div>
    </div>
  );
};

export default AccountSection; 