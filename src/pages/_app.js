import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@/styles/nextjs.scss";

// Forçar prioridade do CSS do template sobre o Tailwind
import "@/styles/nextjs.scss";
import "@/styles/nextjs.scss";
import "@/styles/index.css";
import "@/styles/investments.css";
import "@/styles/marketplace.css";
import "@/styles/p2p-offers.css";
import "@/components/header/DarkmodeSwitcher/DarkModeSwitcher.css";

import { AppSettingsProvider } from "@/config/app-settings";
import { Layout } from "@/layouts/layout";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/router";

import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    let isMounted = true;
    const loadBootstrap = async () => {
      try {
        const bootstrap = await import("bootstrap");
        if (isMounted) {
          window.bootstrap = bootstrap;
        }
      } catch (err) {
        console.error("Error loading Bootstrap:", err);
      }
    };
    if (typeof window !== "undefined") {
      loadBootstrap();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const router = useRouter();
  const isProtected = ![
    "/",
    "/login",
    "/admin",
    "/admin/login",
    "/register",
  ].includes(router.pathname);

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
        <QueryClientProvider client={queryClient}>
          {isProtected ? (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </QueryClientProvider>
      </Layout>
    </AppSettingsProvider>
  );
}

export default MyApp;
