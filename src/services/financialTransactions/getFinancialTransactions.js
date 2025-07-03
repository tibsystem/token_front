import api from '@/services/api';

export async function getFinancialTransactions() {
  try {
    const response = await api.get(`/transacoes-financeiras`);
    return response.data;
  } catch (error) {
    // console.error
    throw error;
  }
}