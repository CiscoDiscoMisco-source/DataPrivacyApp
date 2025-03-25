import React from 'react';
import NavLink from './NavLink';

const Navigation: React.FC = () => {
  const navItems = [
    { href: '/companies', label: 'Companies' },
    { href: '/preferences', label: 'Preferences' },
    { href: '/settings', label: 'Settings' }
  ];
  
  return (
    <nav className="py-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neu-flat-contrast p-4 border-b-4 border-primary-500">
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-800">Data Privacy App</span>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {navItems.map(item => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden mt-2">
        <div className="space-y-2 px-4">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href} mobileView>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 