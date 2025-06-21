import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [imoveis, setImoveis] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: wallet } = await api.get('/wallet');
      setSaldo(wallet.balance || 0);
      const { data: props } = await api.get('/properties');
      setImoveis(props);
      const { data: hist } = await api.get('/investments/history');
      setHistorico(hist);
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-3">
      <h2>Dashboard</h2>
      <p><strong>Saldo:</strong> {saldo}</p>

      <h3>Imóveis disponíveis</h3>
      <ul>
        {imoveis.map((prop) => (
          <li key={prop.id}>{prop.name}</li>
        ))}
      </ul>

      <h3>Histórico de investimentos</h3>
      <ul>
        {historico.map((item) => (
          <li key={item.id}>{item.property_name} - {item.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
