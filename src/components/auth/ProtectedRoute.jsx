import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função para determinar a rota de login correta
  const getLoginRoute = () => {
    const isAdminRoute = router.pathname.startsWith('/admin');
    const hasAdminToken = Boolean(localStorage.getItem('admin_token'));
    const loginRoute = (isAdminRoute || hasAdminToken) ? '/admin/login' : '/login';
    
    
    return loginRoute;
  };

  useEffect(() => {
    
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('admin_token');
        const anyToken = token || adminToken;
        const loginRoute = getLoginRoute();
        
       
        if (!anyToken) {
          toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
          router.push(loginRoute);
          return;
        }
        try {
          const payload = JSON.parse(atob(anyToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('admin_token');
            toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
            router.push(loginRoute);
            return;
          }
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('admin_token');
          toast.error('Token inválido. Por favor, faça login novamente.');
          router.push(loginRoute);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const loginRoute = getLoginRoute();
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
            router.push(loginRoute);
          } else {
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('admin_token');
          router.push(loginRoute);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    
    const handleStorageChange = (e) => {
      
      if (e.key === 'token' || e.key === 'admin_token') {
        if (!e.newValue) {
          setIsAuthenticated(false);
          const loginRoute = getLoginRoute();
          router.push(loginRoute);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}