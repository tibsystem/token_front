import api from '@/services/api';

export const getPropertiesTokens = async (propertyId) => {
  try {
    const response = await api.get(`/properties/${propertyId}/tokens`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property tokens:", error);
    throw error;
  }
};
