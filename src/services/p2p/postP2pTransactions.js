import api from '@/services/api';

export async function postP2pTransactions(data) {
  try {
    const response = await api.post('/p2p-transactions', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao cadastrar transação P2P:', error);
    throw error;
  }
}