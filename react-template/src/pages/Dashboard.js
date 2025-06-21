import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [properties, setProperties] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/wallet').then(setWallet).catch(() => {});
    api.get('/properties').then(setProperties).catch(() => {});
    api.get('/investments/history').then(setHistory).catch(() => {});
  }, []);

  return (
    <div className="p-3">
      <h2>Dashboard</h2>
      <div className="mb-3">Saldo: {wallet ? wallet.balance : '-'}</div>
      <h4>Imóveis Disponíveis</h4>
      <ul>
        {properties.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
      <h4>Histórico de Investimentos</h4>
      <ul>
        {history.map(h => <li key={h.id}>{h.property} - {h.amount}</li>)}
      </ul>
    </div>
  );
}
