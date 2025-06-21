import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/investments/history').then(setHistory).catch(() => {});
  }, []);

  return (
    <div className="p-3">
      <h2>Histórico</h2>
      <ul>
        {history.map(h => (
          <li key={h.id}>{h.property} - {h.amount}</li>
        ))}
      </ul>
    </div>
  );
}
