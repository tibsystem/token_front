import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties')
      .then((res) => setImoveis(res.data))
      .catch(() => setError('Erro ao carregar imóveis.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Imóveis Disponíveis</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando imóveis...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis.length === 0 && !loading && <li className="col-span-full text-gray-500">Nenhum imóvel disponível.</li>}
        {imoveis.map((imovel) => (
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
