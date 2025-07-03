import api from '@/services/api';

export async function getInvestments(userId) {
  try {
    const response = await api.get(`/investments/${userId}`);
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar investimentos:', error);
    throw error;
  }
}