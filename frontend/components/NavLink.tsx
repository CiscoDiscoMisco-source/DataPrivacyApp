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
      ? 'glass-dark text-primary-50' 
      : 'glass text-primary-100 hover:bg-primary-200/20 hover:text-primary-50'
  } ${className}`;
  
  // Mobile styling
  const mobileClasses = `block p-3 glass text-center ${
    isActive 
      ? 'glass-dark text-primary-50' 
      : 'text-primary-100 hover:bg-primary-200/20 hover:text-primary-50'
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