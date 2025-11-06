import Layout from '../components/Layout';
import '../styles/globals.css';
import '../styles/nprogress.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { AuthProvider, useAuth } from '../context/AuthContext';

// This component handles the main logic for auth protection
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading the user state
    if (loading) {
      return;
    }

    // If user is not logged in and not on the login page, redirect them
    if (!user && router.pathname !== '/login') {
      // Store the path they were trying to access
      const redirectUrl = `/login?redirect=${router.asPath}`;
      router.push(redirectUrl);
    }
  }, [user, loading, router]);

  // While loading, we can show a blank page or a spinner
  if (loading) {
    return null; 
  }

  // If the user is not logged in and we are on a protected page,
  // the redirect is in progress, so we can return null to avoid flashing content.
  if (!user && router.pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  // The login page does not have the main Layout
  const isLoginPage = router.pathname === '/login';

  return (
    <AuthProvider>
      <AuthGuard>
        {isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthGuard>
    </AuthProvider>
  );
}

export default MyApp;