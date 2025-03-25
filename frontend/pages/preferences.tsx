import React from 'react';
import { NextPage } from 'next';
import PreferencesPage from '../components/PreferencesPage';
import Layout from '../components/Layout';

const PreferencesPageWrapper: NextPage = () => {
  return (
    <Layout title="Preferences | Data Privacy App">
      <PreferencesPage />
    </Layout>
  );
};

export default PreferencesPageWrapper; 