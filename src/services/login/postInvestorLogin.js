import api from '@/services/api';

export async function postInvestorLogin(data) {
  try {
    const response = await api.post('/auth/investor-login', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao fazer login do investidor:', error);
    throw error;
  }
}