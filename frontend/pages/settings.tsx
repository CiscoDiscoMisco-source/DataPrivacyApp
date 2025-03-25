import React from 'react';
import { NextPage } from 'next';
import SettingsPage from '../components/SettingsPage';
import Layout from '../components/Layout';

const SettingsPageWrapper: NextPage = () => {
  return (
    <Layout title="Settings | Data Privacy App">
      <SettingsPage />
    </Layout>
  );
};

export default SettingsPageWrapper; 