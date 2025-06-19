import React from 'react';
import DirectorySection from '@/components/shared/sections/DirectorySection';

const DirectoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Alumni Directory</h1>
      <p className="text-center text-gray-600 mb-8">
        Connect with fellow alumni from your institution.
      </p>
      
      <DirectorySection />
    </div>
  );
};

export default DirectoryPage;
