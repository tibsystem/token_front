import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function ImovelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState(null);
  const [valorUnitario, setValorUnitario] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/properties/${id}`)
        .then((res) => {
          setProperty(res.data);
          setValorUnitario(res.data.valor_unitario || '');
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              window.location.href = '/user/login-v3';
            }
          } else {
            setError('Erro ao carregar imóvel.');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePurchase = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let id_investidor = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          id_investidor = payload.id || payload.user_id || payload.sub;
        } catch {
        }
      }
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const data_compra = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const payload = {
        id_investidor,
        id_imovel: Number(id),
        qtd_tokens: Number(amount),
        valor_unitario: Number(valorUnitario) || 0,
        data_compra,
        origem: 'plataforma',
        status: 'ativo',
      };
      await api.post('/investments/purchase', payload);
      alert('Compra realizada!');
    } catch (error) {
      console.error(error);
      alert('Erro na compra');
    }
  };

  if (loading) return <div className="p-4 text-gray-500 animate-pulse">Carregando imóvel...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!property) return <div className="p-4">Imóvel não encontrado.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-theme">{property.titulo}</h1>
        <div className="mb-2 text-gray-700 text-lg">{property.descricao}</div>
        <div className="mb-1 text-sm"><b>Localização:</b> {property.localizacao}</div>
        <div className="mb-1 text-sm"><b>Valor Total:</b> R$ {Number(property.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        <div className="mb-1 text-sm"><b>Tokens:</b> {property.qtd_tokens}</div>
        <div className="mb-1 text-sm"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${property.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{property.status}</span></div>
        <div className="mb-1 text-sm"><b>Data Tokenização:</b> {property.data_tokenizacao}</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Comprar tokens deste imóvel</h2>
        <div className="space-y-2">
          <label className="block font-medium">Quantidade de tokens:</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <label className="block font-medium">Valor unitário:</label>
          <input
            type="number"
            min="0"
            value={valorUnitario}
            onChange={(e) => setValorUnitario(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handlePurchase}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full mt-4 transition"
          >
            Comprar Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
