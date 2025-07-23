import api from '@/services/api';

export const postWithdrawFunds = async (userId, amount) => {
  try {
    const response = await api.post(`/wallet/withdraw`, { userId, amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};
