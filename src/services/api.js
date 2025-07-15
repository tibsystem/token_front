import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend.ib3capital.app.br/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('token');
    
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      if (adminToken) {
        config.baseURL = 'https://backend.ib3capital.app.br/api/admin';
      } else {
        config.baseURL = 'https://backend.ib3capital.app.br/api/investor';
      }
    }
 
  }
  return config;
});

export default api;
