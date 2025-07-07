import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
        const isAdmin = Boolean(localStorage.getItem('admin_token'));
        const loginRoute = isAdmin ? '/admin/login' : '/login';
        if (!token) {
          toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
          router.push(loginRoute);
          return;
        }
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
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
          console.error('Erro ao validar token:', error);
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
      const isAdmin = Boolean(localStorage.getItem('admin_token'));
      const loginRoute = isAdmin ? '/admin/login' : '/login';
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
          toast.info('Você foi desconectado.');
          const isAdmin = Boolean(localStorage.getItem('admin_token'));
          const loginRoute = isAdmin ? '/admin/login' : '/login';
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