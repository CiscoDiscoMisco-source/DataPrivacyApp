import dynamic from 'next/dynamic';
import { NextPage } from 'next';

// Use dynamic import with no SSR to avoid hydration issues
const CompaniesPageComponent = dynamic(
  () => import('../components/CompaniesPage'),
  { ssr: false }
);

const Companies: NextPage = () => {
  return <CompaniesPageComponent />;
};

export default Companies; 