'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/protected-route';
import { AmplifyProvider } from '@/components/amplify-provider';
import { Toaster } from '@/components/ui/toaster';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AmplifyProvider>
      <AuthProvider>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
        <Toaster />
      </AuthProvider>
    </AmplifyProvider>
  );
} 