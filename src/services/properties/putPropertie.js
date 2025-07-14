import api from '@/services/api';

export async function putPropertie(id, data) {
    try {
        const response = await api.put(`/properties/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar propriedade:', error);
        throw error;
    }
}