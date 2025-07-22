import api from '@/services/api';

export async function postInvestmentsPurchase(data) {
  try {
    const response = await api.post('/investments/', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao realizar compra de investimento:', error);
    throw error;
  }
}