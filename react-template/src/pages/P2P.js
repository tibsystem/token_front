import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function P2P() {
  const [listings, setListings] = useState([]);
  const [amount, setAmount] = useState('');
  const [propertyId, setPropertyId] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    api.get('/p2p/listings').then(setListings).catch(() => {});
  };

  const createListing = async (e) => {
    e.preventDefault();
    await api.post('/p2p/listings', { property_id: propertyId, amount });
    setAmount('');
    setPropertyId('');
    load();
  };

  const buy = async (id) => {
    await api.post('/p2p/transactions', { listing_id: id });
    load();
  };

  return (
    <div className="p-3">
      <h2>Oferta P2P</h2>
      <form onSubmit={createListing} className="mb-3">
        <input className="form-control mb-2" placeholder="ID do Imóvel" value={propertyId} onChange={e => setPropertyId(e.target.value)} required />
        <input className="form-control mb-2" placeholder="Quantidade" value={amount} onChange={e => setAmount(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Criar Oferta</button>
      </form>
      <ul>
        {listings.map(l => (
          <li key={l.id} className="mb-2">
            {l.property} - {l.amount}
            <button className="btn btn-sm btn-success ms-2" onClick={() => buy(l.id)}>Comprar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
