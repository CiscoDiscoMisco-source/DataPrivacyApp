'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, User, Settings } from 'lucide-react';

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-white" />
          <Link href="/" className="text-xl font-bold">
            Data Privacy Manager
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-1">
            <span className="text-sm">
              <span className="opacity-80">Signed in as</span>{' '}
              <span className="font-medium">{user.username}</span>
            </span>
          </div>
          
          <Link href="/global-preferences">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          
          <Link href="/profile">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
} 