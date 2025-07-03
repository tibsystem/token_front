import api from '@/services/api';

export async function getProperties() {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar propriedades:', error);
    throw error;
  }
}