import api from '@/services/api';

export async function postLogin(data) {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao fazer login:', error);
    throw error;
  }
} 