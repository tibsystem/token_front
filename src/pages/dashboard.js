import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function DashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, propRes] = await Promise.all([
          api.get('/wallet'),
          api.get('/properties'),
        ]);
        setWallet(walletRes.data);
        setProperties(propRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      {wallet && (
        <div className="mb-6">
          <h2 className="text-lg">Saldo: R$ {wallet.balance}</h2>
        </div>
      )}
      <h2 className="text-xl mb-2">Imóveis</h2>
      <ul className="space-y-2">
        {properties.map((prop) => (
          <li key={prop.id} className="border p-4 rounded">
            <div className="font-bold">{prop.name}</div>
            <Link href={`/imoveis/${prop.id}`} className="text-blue-500">
              Ver detalhes
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
