import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Data Privacy App</p>
      </div>
    </footer>
  );
};

export default Footer; 