import api from '@/services/api';

export async function getInvestments() {
  try {
    const response = await api.get(`/investments`);
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar investimentos:', error);
    throw error;
  }
}