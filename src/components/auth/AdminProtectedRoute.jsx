import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🔐 [AdminProtectedRoute] Iniciando verificação de autenticação admin');
    console.log('🔐 [AdminProtectedRoute] Router pathname:', router.pathname);
    
    const checkAdminAuth = () => {
      if (typeof window !== 'undefined') {
        // Especificamente para admin, verificar admin_token
        const adminToken = localStorage.getItem('admin_token');
        const regularToken = localStorage.getItem('token');
        
        console.log('🔐 [AdminProtectedRoute] Tokens encontrados:');
        console.log('  - admin_token:', adminToken ? 'EXISTS' : 'NULL');
        console.log('  - token:', regularToken ? 'EXISTS' : 'NULL');
        
        if (!adminToken) {
          console.log('❌ [AdminProtectedRoute] Admin token não encontrado - redirecionando para /admin/login');
          toast.warning('Acesso restrito. Por favor, faça login como administrador.');
          router.push('/admin/login');
          return;
        }

        try {
          console.log('🔍 [AdminProtectedRoute] Validando admin token...');
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          console.log('🔍 [AdminProtectedRoute] Token payload:', {
            exp: payload.exp,
            currentTime: currentTime,
            isExpired: payload.exp < currentTime
          });
          
          if (payload.exp && payload.exp < currentTime) {
            console.log('⏰ [AdminProtectedRoute] Token expirado - limpando e redirecionando');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão de administrador expirou. Por favor, faça login novamente.');
            router.push('/admin/login');
            return;
          }
          
          console.log('✅ [AdminProtectedRoute] Token válido - usuário autenticado');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('💥 [AdminProtectedRoute] Erro ao validar token:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('profileData');
          toast.error('Token de administrador inválido. Por favor, faça login novamente.');
          router.push('/admin/login');
        } finally {
          console.log('🏁 [AdminProtectedRoute] Finalizando verificação - setIsLoading(false)');
          setIsLoading(false);
        }
      }
    };

    checkAdminAuth();

    // Verificar periodicamente se o token ainda é válido
    console.log('⏱️ [AdminProtectedRoute] Configurando interval para verificação periódica (30s)');
    const interval = setInterval(() => {
      console.log('⏱️ [AdminProtectedRoute] Verificação periódica executando...');
      const adminToken = localStorage.getItem('admin_token');
      
      if (adminToken) {
        try {
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            console.log('⏰ [AdminProtectedRoute] Token expirou durante verificação periódica');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão de administrador expirou. Por favor, faça login novamente.');
            router.push('/admin/login');
          } else {
            console.log('✅ [AdminProtectedRoute] Token ainda válido na verificação periódica');
          }
        } catch {
          console.log('💥 [AdminProtectedRoute] Erro na verificação periódica - redirecionando');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      } else {
        console.log('❌ [AdminProtectedRoute] Token não encontrado na verificação periódica - redirecionando');
        router.push('/admin/login');
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [router]);

  // Verificar mudanças no localStorage
  useEffect(() => {
    console.log('👂 [AdminProtectedRoute] Configurando listener para mudanças no localStorage');
    
    const handleStorageChange = (e) => {
      console.log('🔄 [AdminProtectedRoute] Mudança detectada no localStorage:', {
        key: e.key,
        oldValue: e.oldValue ? 'EXISTS' : 'NULL',
        newValue: e.newValue ? 'EXISTS' : 'NULL'
      });
      
      if (e.key === 'admin_token' && !e.newValue) {
        console.log('❌ [AdminProtectedRoute] Admin token removido - desautenticando e redirecionando');
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  if (isLoading) {
    console.log('⏳ [AdminProtectedRoute] Ainda carregando - mostrando spinner');
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 [AdminProtectedRoute] Usuário não autenticado - retornando null');
    return null;
  }

  console.log('✅ [AdminProtectedRoute] Usuário autenticado - renderizando children');
  return children;
}
