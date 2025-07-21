import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      if (typeof window !== 'undefined') {
        // Especificamente para admin, verificar admin_token
        const adminToken = localStorage.getItem('admin_token');
        
        if (!adminToken) {
          toast.warning('Acesso restrito. Por favor, faça login como administrador.');
          router.push('/admin/login');
          return;
        }

        try {
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão de administrador expirou. Por favor, faça login novamente.');
            router.push('/admin/login');
            return;
          }
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao validar token de admin:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('profileData');
          toast.error('Token de administrador inválido. Por favor, faça login novamente.');
          router.push('/admin/login');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAdminAuth();

    // Verificar periodicamente se o token ainda é válido
    const interval = setInterval(() => {
      const adminToken = localStorage.getItem('admin_token');
      
      if (adminToken) {
        try {
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão de administrador expirou. Por favor, faça login novamente.');
            router.push('/admin/login');
          }
        } catch {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [router]);

  // Verificar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_token' && !e.newValue) {
        setIsAuthenticated(false);
        router.push('/admin/login');
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
