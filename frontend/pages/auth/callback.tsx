import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../services/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the code from the URL
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');

      if (code) {
        try {
          // Exchange the code for a session
          const { error, data } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            router.push('/login?error=Authentication failed');
            return;
          }

          if (data.session) {
            // Store auth data
            localStorage.setItem('dp_access_token', data.session.access_token);
            localStorage.setItem('dp_user_id', data.session.user.id);
            
            // Redirect to main page
            router.push('/companies');
          } else {
            router.push('/login?error=No session returned');
          }
        } catch (err) {
          console.error('Callback processing error:', err);
          router.push('/login?error=Authentication processing failed');
        }
      } else {
        router.push('/login?error=No authentication code found');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="glass-premium p-8 max-w-sm w-full text-center">
        <h1 className="glass-heading text-2xl mb-4">Completing Authentication</h1>
        <p className="glass-text">Please wait while we complete your sign-in...</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-accent-300"></div>
        </div>
      </div>
    </div>
  );
} 