import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';

export default function NovaOfertaPage() {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/p2p/listings', {
        property_id: propertyId,
        amount,
        price,
      });
      router.push('/p2p/ofertas');
    } catch (error) {
      console.error(error);
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
      </form>
    </div>
  );
}
