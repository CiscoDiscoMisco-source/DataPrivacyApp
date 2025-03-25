import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  mobileView?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  mobileView = false 
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  // Desktop styling
  const desktopClasses = `px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
    isActive 
      ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-b-2 border-primary-500' 
      : 'shadow-neu-flat text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
  } ${className}`;
  
  // Mobile styling
  const mobileClasses = `block p-3 neu-flat text-center ${
    isActive 
      ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-l-4 border-primary-500' 
      : 'text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
  } ${className}`;
  
  return (
    <Link 
      href={href}
      className={mobileView ? mobileClasses : desktopClasses}
    >
      {children}
    </Link>
  );
};

export default NavLink; 