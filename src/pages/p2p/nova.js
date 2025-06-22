import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';

export default function NovaOfertaPage() {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Recupera o vendedor_id do token salvo (ajuste conforme seu backend)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let vendedor_id = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          vendedor_id = payload.id || payload.user_id || payload.sub;
        } catch {
        }
      }
      const payload = {
        vendedor_id,
        id_imovel: Number(propertyId),
        qtd_tokens: Number(amount),
        valor_unitario: Number(price)
      };
      await api.post('/p2p/listings', payload);
      router.push('/p2p/ofertas');
    } catch (error) {
      console.error(error);
      setError('Erro ao criar oferta');
      alert('Erro ao criar oferta');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Nova Oferta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="ID do Imóvel"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Quantidade de tokens"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Preço por token"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
          Criar Oferta
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}
