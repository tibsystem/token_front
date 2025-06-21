import React, { useEffect, useState } from 'react';
import api from '../api/api';

function P2P() {
  const [listings, setListings] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await api.get('/p2p/listings');
    setListings(data);
  };

  const createListing = async (e) => {
    e.preventDefault();
    await api.post('/p2p/listings', { token_id: tokenId, price });
    setTokenId('');
    setPrice('');
    fetchListings();
  };

  const buy = async (id) => {
    await api.post('/p2p/transactions', { listing_id: id });
    fetchListings();
  };

  return (
    <div className="container mt-3">
      <h2>P2P</h2>
      <form onSubmit={createListing} className="mb-3" style={{ maxWidth: 400 }}>
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="ID do Token"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Vender</button>
      </form>
      <h3>Listagens</h3>
      <ul>
        {listings.map((l) => (
          <li key={l.id} className="mb-2">
            Token {l.token_id} - {l.price}
            <button
              className="btn btn-sm btn-success ms-2"
              onClick={() => buy(l.id)}
            >
              Comprar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default P2P;
