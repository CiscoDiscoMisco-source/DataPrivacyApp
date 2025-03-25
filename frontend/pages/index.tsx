import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main application
    router.push('/companies');
  }, [router]);
  
  return (
    <Layout title="Welcome | Data Privacy App">
      <div className="flex justify-center items-center py-12">
        <div className="max-w-md mx-auto">
          <div>
            <h1 className="text-2xl font-semibold text-center">Data Privacy App</h1>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <p className="text-center">Redirecting to application...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 