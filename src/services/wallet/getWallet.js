import api from '../api';

export async function getWallet(userId) {
  try {
    const response = await api.get(`/wallet/${userId}`);
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar carteira:', error);
    throw error;
  }
}