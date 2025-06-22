import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function ImovelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (id) {
      api.get(`/properties/${id}`).then((res) => setProperty(res.data));
    }
  }, [id]);

  const handlePurchase = async () => {
    try {
      await api.post('/investments/purchase', { property_id: id, amount });
      alert('Compra realizada!');
    } catch (error) {
      console.error(error);
      alert('Erro na compra');
    }
  };

  if (!property) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{property.name}</h1>
      <p className="mb-4">{property.description}</p>
      <div className="space-y-2">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handlePurchase}
          className="bg-green-500 text-white px-4 py-2"
        >
          Comprar Tokens
        </button>
      </div>
    </div>
  );
}
