import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const CompaniesPage = dynamic(
  () => import('../src/pages/CompaniesPage'),
  { ssr: false }
);

export default function Companies() {
  return <CompaniesPage />;
} 