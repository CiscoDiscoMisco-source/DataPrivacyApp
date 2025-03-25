import { AuthProvider } from '../src/contexts/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // Client-side only
  if (typeof window === 'undefined') {
    return null;
  }
  
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
} 