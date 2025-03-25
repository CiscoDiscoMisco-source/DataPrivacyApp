import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const PreferencesPage = dynamic(
  () => import('../src/pages/PreferencesPage'),
  { ssr: false }
);

export default function Preferences() {
  return <PreferencesPage />;
} 