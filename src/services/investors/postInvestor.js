import api from '@/services/api';

export async function postInvestor(data) {
  try {
    const response = await api.post('/investors', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao cadastrar investidor:', error);
    throw error;
  }
}