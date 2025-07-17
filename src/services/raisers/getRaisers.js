import api from '@/services/api';

export async function getRaisers() {
  try {
    const response = await api.get('/raisers');
    return response.data;
  } catch (error) {
    console.error("Error fetching raisers:", error);
    throw error;
  }
}
