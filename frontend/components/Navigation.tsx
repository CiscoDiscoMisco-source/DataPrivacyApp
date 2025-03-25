import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Companies', path: '/companies' },
    { name: 'Settings', path: '/settings' },
    { name: 'Preferences', path: '/preferences' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            {isAuthenticated && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      router.pathname === item.path
                        ? 'glass-dark text-primary-50 border border-primary-400/30'
                        : 'text-primary-100 hover:bg-primary-500/20 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="flex items-center ml-4 pl-4 border-l border-primary-600/30">
                  {user && (
                    <div className="mr-4">
                      <span className="text-sm text-primary-200">{user.name}</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="glass-button px-4 py-2 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    router.pathname === '/login'
                      ? 'glass-dark text-primary-50 border border-primary-400/30'
                      : 'text-primary-100 hover:bg-primary-500/20 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                
                <Link
                  href="/signup"
                  className="glass-button px-4 py-2 text-sm bg-accent-500/40 hover:bg-accent-500/60"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 