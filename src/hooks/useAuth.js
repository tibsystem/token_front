import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const getUserFromToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            return null;
          }
          
          return {
            id: payload.id || payload.user_id || payload.sub,
            email: payload.email,
            name: payload.name || payload.username,
            exp: payload.exp
          };
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const checkAuth = useCallback(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('./login');
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      const userData = getUserFromToken();
      if (!userData && isAuthenticated) {
        logout();
      }
    }, 30000); 

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    checkAuth
  };
}
