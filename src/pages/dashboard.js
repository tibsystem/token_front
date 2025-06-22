import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function DashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          console.log('Token salvo no localStorage:', token);
        }
        const [walletRes, propRes] = await Promise.all([
          api.get('/wallet'),
          api.get('/properties'),
        ]);
        setWallet(walletRes.data);
        setProperties(propRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError(err?.response?.data?.message || err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Dashboard</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando informações...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
      )}
      {wallet && (
        <div className="mb-8 flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-6 shadow">
          <div className="text-2xl font-semibold">Saldo em carteira</div>
          <div className="text-3xl font-bold ml-auto">R$ {Number(wallet.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Imóveis disponíveis</h2>
        <Link href="/imoveis" className="text-blue-600 hover:underline font-medium">Ver todos</Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 && !loading && <li className="col-span-full text-gray-500">Nenhum imóvel disponível.</li>}
        {properties.slice(0, 6).map((imovel) => (
          <li key={imovel.id} className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-5 flex flex-col">
            <div className="font-bold text-lg mb-1 text-theme">{imovel.titulo}</div>
            <div className="mb-2 text-gray-700 line-clamp-2">{imovel.descricao}</div>
            <div className="mb-1 text-sm"><b>Localização:</b> {imovel.localizacao}</div>
            <div className="mb-1 text-sm"><b>Valor Total:</b> R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="mb-1 text-sm"><b>Tokens:</b> {imovel.qtd_tokens}</div>
            <div className="mb-1 text-sm"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${imovel.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{imovel.status}</span></div>
            <div className="mb-1 text-sm"><b>Data Tokenização:</b> {imovel.data_tokenizacao}</div>
            <Link href={`/imoveis/${imovel.id}`} className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Ver detalhes</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
