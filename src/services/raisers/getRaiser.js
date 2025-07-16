import api from '@/services/api';

export async function getRaiser(id) {
  try {
    const response = await api.get(`/raisers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching raiser:", error);
    throw error;
  }
}
