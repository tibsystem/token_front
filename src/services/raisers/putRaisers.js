import api from '@/services/api';

export async function putRaisers(id, data) {
  try {
    const response = await api.put(`/raisers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update raiser:', error);
    throw error;
  }
}   