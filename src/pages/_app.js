import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@/styles/nextjs.scss';

// Forçar prioridade do CSS do template sobre o Tailwind
import '@/styles/nextjs.scss';
import '@/styles/nextjs.scss';

import { AppSettingsProvider } from '@/config/app-settings';
import { Layout } from '@/app/layout';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

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
      <Head>
        <link rel="icon" href="/assets/img/icon.png" />
        <title>IB3 - Investing</title>
      </Head>
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Component {...pageProps} />
      </Layout>
    </AppSettingsProvider>
  );
}

export default MyApp;
