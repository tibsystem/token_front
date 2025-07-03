import api from '@/services/api';

export async function getInvestors() {
  try {
    const response = await api.get('/investors');
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar investidores:', error);
    throw error;
  }
}