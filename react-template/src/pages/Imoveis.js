import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Imoveis() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get('/properties').then(setProperties).catch(() => {});
  }, []);

  return (
    <div className="p-3">
      <h2>Imóveis</h2>
      <ul>
        {properties.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
