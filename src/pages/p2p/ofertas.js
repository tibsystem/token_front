import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function OfertasP2PPage() {
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/p2p/listings')
      .then((res) => setOfertas(res.data?.data || []))
      .catch(() => setError('Erro ao carregar ofertas.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Ofertas P2P Disponíveis</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando ofertas...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <ul className="space-y-6">
        {ofertas.length === 0 && !loading && <li className="text-gray-500">Nenhuma oferta disponível.</li>}
        {ofertas.map((oferta) => (
          <li key={oferta.id} className="bg-white border border-gray-200 rounded-xl shadow p-5 flex flex-col">
            <div className="font-bold text-lg mb-1 text-theme">Oferta #{oferta.id}</div>
            <div className="mb-1 text-sm"><b>ID do Imóvel:</b> {oferta.id_imovel}</div>
            <div className="mb-1 text-sm"><b>Quantidade de tokens:</b> {oferta.qtd_tokens}</div>
            <div className="mb-1 text-sm"><b>Valor unitário:</b> R$ {Number(oferta.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="mb-1 text-sm"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${oferta.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{oferta.status}</span></div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded transition" disabled>
              Comprar tokens
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
