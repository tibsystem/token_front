import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Imoveis() {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    api.get('/properties').then(({ data }) => setImoveis(data));
  }, []);

  return (
    <div className="container mt-3">
      <h2>Imóveis</h2>
      <ul>
        {imoveis.map((prop) => (
          <li key={prop.id}>{prop.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Imoveis;
