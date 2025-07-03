import api from '@/services/api';

export async function postP2pListings(data) {
  try {
    const response = await api.post('/p2p/listings', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao cadastrar oferta P2P:', error);
    throw error;
  }
}