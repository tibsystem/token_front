import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@/styles/nextjs.scss';

import { AppSettingsProvider } from '@/config/app-settings';
import { Layout } from '@/app/layout';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    let isMounted = true;
    const loadBootstrap = async () => {
      try {
        const bootstrap = await import('bootstrap');
        if (isMounted) {
          window.bootstrap = bootstrap;
        }
      } catch (err) {
        console.error('Error loading Bootstrap:', err);
      }
    };
    if (typeof window !== 'undefined') {
      loadBootstrap();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppSettingsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppSettingsProvider>
  );
}

export default MyApp;
