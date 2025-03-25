import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Companies', path: '/companies' },
    { name: 'Settings', path: '/settings' },
    { name: 'Preferences', path: '/preferences' },
  ];

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-50">Data Privacy App</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  router.pathname === item.path
                    ? 'bg-primary-600/30 text-primary-50 backdrop-blur-md border border-primary-400/30'
                    : 'text-primary-100 hover:bg-primary-500/20 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 