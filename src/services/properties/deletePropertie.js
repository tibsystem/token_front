import api from '@/services/api'; 
export async function deletePropertie(id) {
    try {
        const response = await api.delete(`/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir propriedade:', error);
        throw error;
    }
}