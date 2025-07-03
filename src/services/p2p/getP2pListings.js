import api from '@/services/api';

export async function getP2pListings() {
  try {
    const response = await api.get('/p2p/listings');
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar listagens P2P:', error);
    throw error;
  }
}