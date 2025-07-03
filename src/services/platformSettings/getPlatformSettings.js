import api from '@/services/api';

export async function getPlatformSettings() {
  try {
    const response = await api.get('/platform-settings');
    return response.data;
  } catch (error) {
    // console.error('Erro ao buscar configurações da plataforma:', error);
    throw error;
  }
}