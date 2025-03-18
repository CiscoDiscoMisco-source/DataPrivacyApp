'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = ['/login'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated and not on a public path, redirect to login
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login');
      }
      
      // If authenticated and on login page, redirect to home
      if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, isLoading, router, pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If on a public path or authenticated, show children
  if (publicPaths.includes(pathname) || user) {
    return <>{children}</>;
  }

  // Otherwise, render nothing while redirecting
  return null;
} 