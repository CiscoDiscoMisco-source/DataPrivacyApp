'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Coins } from 'lucide-react';
import { useEffect, useState } from 'react';
import dataService from '@/services/dataService';
import { User } from '@/models/user';

export const NavBar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data
    const userData = dataService.getUser();
    setUser(userData);
  }, []);

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl">
            DataPrivacy
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className={pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Companies
            </Link>
            <Link href="/global-preferences" className={pathname === '/global-preferences' ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Global Preferences
            </Link>
            <Link href="/tokens" className={pathname === '/tokens' ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Token Store
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/tokens" className="flex items-center gap-1 text-sm">
            <Coins className="h-4 w-4 text-primary" />
            <span className="font-medium">{user?.tokens || 0} Tokens</span>
          </Link>
          
          <Button asChild size="sm" variant="outline">
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}; 