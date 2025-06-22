import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function InvestimentosPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transacoes-financeiras')
      .then((res) => setTransacoes(res.data || []))
      .catch(() => setError('Erro ao carregar transações.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-theme">Minhas Compras de Tokens</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando compras...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <ul className="space-y-6">
        {transacoes.length === 0 && !loading && <li className="text-gray-500">Nenhuma compra encontrada.</li>}
        {transacoes.map((item) => (
          <li key={item.id} className="bg-white border border-gray-200 rounded-xl shadow p-5 flex flex-col">
            <div className="font-bold text-lg mb-1 text-theme">Compra #{item.id}</div>
            <div className="mb-1 text-sm"><b>Tipo:</b> {item.tipo}</div>
            <div className="mb-1 text-sm"><b>Valor:</b> R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="mb-1 text-sm"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{item.status}</span></div>
            <div className="mb-1 text-sm"><b>Referência:</b> {item.referencia}</div>
            <div className="mb-1 text-sm"><b>Data da Transação:</b> {item.data_transacao}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
