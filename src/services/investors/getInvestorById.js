import api from '@/services/api';

export async function getInvestorById(id) {
  try {
    const response = await api.get(`/investors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar investidor:', error);
    throw error;
  }
}
