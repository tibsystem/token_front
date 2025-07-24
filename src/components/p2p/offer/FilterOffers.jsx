import { useState, useEffect } from 'react';

export default function OfferFilters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

 
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ searchTerm, sortBy });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, onFilterChange]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fa fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar por nome do imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-5">
            <div className="input-group">
              <label className="input-group-text bg-light text-muted" htmlFor="sort-select">
                <i className="fa fa-sort-amount-down me-2"></i>
                Ordenar por
              </label>
              <select 
                className="form-select" 
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="recent">Mais Recentes</option>
                <option value="price_high">Maior Valor Total</option>
                <option value="price_low">Menor Valor Total</option>
                <option value="tokens_high">Mais Tokens</option>
                <option value="tokens_low">Menos Tokens</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}