import api from '@/services/api';

export async function postProperties(data) {
  try {
    const response = await api.post('/properties', data);
    return response.data;
  } catch (error) {
    // console.error('Erro ao cadastrar propriedade:', error);
    throw error;
  }
}