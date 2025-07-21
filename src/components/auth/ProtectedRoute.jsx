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
    
    console.log('🔍 [ProtectedRoute] Determinando rota de login:', {
      pathname: router.pathname,
      isAdminRoute,
      hasAdminToken,
      loginRoute
    });
    
    return loginRoute;
  };

  useEffect(() => {
    console.log('🔐 [ProtectedRoute] Iniciando verificação de autenticação');
    
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('admin_token');
        const anyToken = token || adminToken;
        const loginRoute = getLoginRoute();
        
        console.log('🔍 [ProtectedRoute] Tokens encontrados:', {
          token: token ? 'EXISTS' : 'NULL',
          adminToken: adminToken ? 'EXISTS' : 'NULL',
          anyToken: anyToken ? 'EXISTS' : 'NULL',
          loginRoute
        });
       
        if (!anyToken) {
          console.log('❌ [ProtectedRoute] Nenhum token encontrado - redirecionando para:', loginRoute);
          toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
          router.push(loginRoute);
          return;
        }
        try {
          console.log('🔍 [ProtectedRoute] Validando token...');
          const payload = JSON.parse(atob(anyToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          console.log('🔍 [ProtectedRoute] Token payload:', {
            exp: payload.exp,
            currentTime: currentTime,
            isExpired: payload.exp < currentTime
          });
          
          if (payload.exp && payload.exp < currentTime) {
            console.log('⏰ [ProtectedRoute] Token expirado - limpando e redirecionando');
            localStorage.removeItem('token');
            localStorage.removeItem('admin_token');
            toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
            router.push(loginRoute);
            return;
          }
          console.log('✅ [ProtectedRoute] Token válido - usuário autenticado');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('💥 [ProtectedRoute] Erro ao validar token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('admin_token');
          toast.error('Token inválido. Por favor, faça login novamente.');
          router.push(loginRoute);
        } finally {
          console.log('🏁 [ProtectedRoute] Finalizando verificação - setIsLoading(false)');
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    console.log('⏱️ [ProtectedRoute] Configurando interval para verificação periódica (30s)');
    const interval = setInterval(() => {
      console.log('⏱️ [ProtectedRoute] Verificação periódica executando...');
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const loginRoute = getLoginRoute();
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            console.log('⏰ [ProtectedRoute] Token expirou durante verificação periódica');
            localStorage.removeItem('token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('profileData');
            toast.warning('Sua sessão expirou. Por favor, faça login novamente.');
            router.push(loginRoute);
          } else {
            console.log('✅ [ProtectedRoute] Token ainda válido na verificação periódica');
          }
        } catch {
          console.log('💥 [ProtectedRoute] Erro na verificação periódica - redirecionando');
          localStorage.removeItem('token');
          localStorage.removeItem('admin_token');
          router.push(loginRoute);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    console.log('👂 [ProtectedRoute] Configurando listener para mudanças no localStorage');
    
    const handleStorageChange = (e) => {
      console.log('🔄 [ProtectedRoute] Mudança detectada no localStorage:', {
        key: e.key,
        oldValue: e.oldValue ? 'EXISTS' : 'NULL',
        newValue: e.newValue ? 'EXISTS' : 'NULL'
      });
      
      if (e.key === 'token' || e.key === 'admin_token') {
        if (!e.newValue) {
          console.log('❌ [ProtectedRoute] Token removido - desautenticando e redirecionando');
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
    console.log('⏳ [ProtectedRoute] Ainda carregando - mostrando spinner');
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 [ProtectedRoute] Usuário não autenticado - retornando null');
    return null;
  }

  console.log('✅ [ProtectedRoute] Usuário autenticado - renderizando children');
  return children;
}