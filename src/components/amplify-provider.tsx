'use client';

import { useEffect, useState } from 'react';
import Amplify from '../amplify-config';

interface AmplifyProviderProps {
  children: React.ReactNode;
}

export function AmplifyProvider({ children }: AmplifyProviderProps) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Amplify is already configured in amplify-config.ts
    setIsConfigured(true);
  }, []);

  // Show loading state while Amplify is being configured
  if (!isConfigured) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 