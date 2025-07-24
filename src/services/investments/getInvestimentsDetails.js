import api from '@/services/api';

export const getInvestmentsDetails = async (investmentId) => {
  try {
    const response = await api.get(`/investments/${investmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching investment details:', error);
    throw error;
  }
};
