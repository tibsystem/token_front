import api from '@/services/api';

export async function postRaisers(data) {
  try {
    const response = await api.post('/raisers', data);
    return response.data;
  } catch (error) {
    console.error("Error posting raisers:", error);
    throw error;
  }
}
