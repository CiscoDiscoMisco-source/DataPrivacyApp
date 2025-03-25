import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const SettingsPage = dynamic(
  () => import('../src/pages/SettingsPage'),
  { ssr: false }
);

export default function Settings() {
  return <SettingsPage />;
} 