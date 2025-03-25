import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to the main application if authenticated
        router.push('/companies');
      }
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return (
      <Layout title="Loading">
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
          <div className="glass-premium max-w-md w-full mx-auto p-8">
            <div className="text-center space-y-6">
              <h1 className="glass-heading text-3xl">Data Privacy App</h1>
              <div className="glass-container bg-primary-900/30">
                <p className="glass-text text-lg">Loading...</p>
                <div className="mt-4">
                  <div className="glass-progress">
                    <div className="glass-progress-bar w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Welcome">
      <div className="min-h-[80vh] flex flex-col justify-center items-center">
        <div className="glass-premium max-w-md w-full mx-auto p-8">
          <div className="text-center space-y-6">
            <h1 className="glass-heading text-3xl">Data Privacy App</h1>
            <div className="glass-container bg-primary-900/30">
              <p className="glass-text text-lg">Redirecting...</p>
              <div className="mt-4">
                <div className="glass-progress">
                  <div className="glass-progress-bar w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 