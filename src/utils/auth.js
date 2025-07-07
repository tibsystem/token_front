import { toast } from 'react-toastify';

// Interceptador para requisições HTTP
export const httpInterceptor = {
  // Intercepta requisições antes de enviar
  request: (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          // Token expirado
          localStorage.removeItem('token');
          localStorage.removeItem('admin_token');
          toast.error('Sua sessão expirou. Redirecionando para login...');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }
        
        // Adiciona o token ao header
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      } catch (error) {
        console.error('Erro ao processar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        toast.error('Token inválido. Redirecionando para login...');
        window.location.href = '/login';
        return Promise.reject(new Error('Token inválido'));
      }
    }
    
    return config;
  },

  // Intercepta respostas
  response: (response) => {
    return response;
  },

  responseError: (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        toast.error('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      if (status >= 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde.');
      }
    } else if (error.request) {
      toast.error('Erro de conexão. Verifique sua internet.');
    }
    
    return Promise.reject(error);
  }
};

export const setupHttpInterceptors = (axiosInstance) => {
  if (axiosInstance && axiosInstance.interceptors) {
    axiosInstance.interceptors.request.use(
      httpInterceptor.request,
      (error) => Promise.reject(error)
    );
    
    axiosInstance.interceptors.response.use(
      httpInterceptor.response,
      httpInterceptor.responseError
    );
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
  
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp ? payload.exp > currentTime : true;
  } catch {
    return false;
  }
};

// Função para fazer logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin_token');
  toast.info('Você foi desconectado.');
  window.location.href = '/login';
};
