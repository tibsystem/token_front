import api from '@/services/api';

export const getInvestmentsHistory = async () => {
  try {
    const response = await api.get(`/investments/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching investment history:', error);
    throw error;
  }
};
