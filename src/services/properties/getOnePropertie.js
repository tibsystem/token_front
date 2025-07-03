import api from '@/services/api';

export async function getOnePropertie(id) {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar propriedade:', error);
    throw error;
  }
}