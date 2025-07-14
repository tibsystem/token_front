import api from '@/services/api';

export async function getPropertyFinance(propertyId) {
  try {
    const response = await api.get(`/properties/${propertyId}/tokens`);
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar finanças da propriedade:', error);
    throw error;
  }
}