import api from '@/services/api';

export default async function deleteRaisers(id) {
  const response = await api.delete(`/raisers/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao excluir captador');
  }
  return response.data;
}