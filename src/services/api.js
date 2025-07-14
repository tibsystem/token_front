import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('token');
    
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      if (adminToken) {
        config.baseURL = 'http://localhost:8000/api/admin';
      } else {
        config.baseURL = 'http://localhost:8000/api/investor';
      }
    }
 
  }
  return config;
});

export default api;
