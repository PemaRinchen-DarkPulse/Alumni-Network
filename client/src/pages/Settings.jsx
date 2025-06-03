import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsPage from '@/components/settings/SettingsPage';
import PageHeader from '@/components/shared/layout/PageHeader';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Settings & Profile" 
        description="Manage your account settings and profile information"
      />
      <SettingsPage />
    </div>
  );
};

export default Settings;
