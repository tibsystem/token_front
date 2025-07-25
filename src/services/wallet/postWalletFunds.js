import api from '@/services/api';

export const postWalletFunds = async (userId, amount) => {
  try {
    const response = await api.post(`/wallet/add-funds`, { userId, valor: amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};
