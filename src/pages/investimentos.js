import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function InvestimentosPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/investments/history').then((res) => setHistory(res.data || []));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Histórico de Investimentos</h1>
      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item.id} className="border p-4 rounded">
            <p>Imóvel: {item.property?.name}</p>
            <p>Quantidade: {item.amount}</p>
            <p>Valor: {item.total_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
