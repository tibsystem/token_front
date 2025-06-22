import { useEffect, useState } from 'react';
import AdminMenu from '@/components/admin/AdminMenu';
import api from '@/services/api';

export default function AdminDashboard() {
  const [investidores, setInvestidores] = useState(0);
  const [imoveis, setImoveis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, imvRes] = await Promise.all([
          api.get('/investors'),
          api.get('/properties'),
        ]);
        setInvestidores(Array.isArray(invRes.data) ? invRes.data.length : 0);
        setImoveis(Array.isArray(imvRes.data) ? imvRes.data.length : 0);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminMenu />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-theme">Dashboard do Administrador</h1>
        {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando dados...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">{investidores}</div>
            <div className="text-lg font-medium text-gray-700">Investidores cadastrados</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-5xl font-bold text-green-600 mb-2">{imoveis}</div>
            <div className="text-lg font-medium text-gray-700">Imóveis cadastrados</div>
          </div>
        </div>
      </main>
    </div>
  );
}
