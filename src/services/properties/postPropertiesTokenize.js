import api from '@/services/api';

export async function postPropertiesTokenize(data) {
  try {
    const response = await api.post(`/properties/${data.id}/tokenize`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
