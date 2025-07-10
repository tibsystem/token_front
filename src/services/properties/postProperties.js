import api from '@/services/api';

export async function postProperties(data) {
  try {
    const response = await api.post('/properties', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    // Captura a mensagem mais amigável, se possível
    const msg = error?.response?.data?.message || "Erro ao cadastrar imóvel";
    throw new Error(msg);
  }
}