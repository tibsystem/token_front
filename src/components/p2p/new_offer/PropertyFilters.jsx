export default function PropertyFilters({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  debouncedSearchTerm,
  filteredCount,
  totalCount,
}) {
  const isSearching = searchTerm !== debouncedSearchTerm;
  const filtersActive = searchTerm || sortBy !== "tokens";

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("tokens");
  };

  return (
    <>
      <div className="row mb-4 g-3">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              {isSearching ? (
                <div className="spinner-border spinner-border-xs text-dark p-0 m-0" style={{width: '1rem', height: '1rem', minWidth: '1rem', minHeight: '1rem'}} role="status">
                  <span className="visually-hidden">Buscando...</span>
                </div>
              ) : (
                <i className="fa fa-search text-muted"></i>
              )}
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar por nome ou descrição do imóvel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              title="Digite para buscar propriedades"
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm("")}
                title="Limpar busca"
              >
                <i className="fa fa-times"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <select
            className={`form-select ${sortBy !== "tokens" ? "border-info bg-info-subtle" : ""}`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Ordenar propriedades"
          >
            <option value="tokens">Ordenar por Tokens (maior)</option>
            <option value="price">Ordenar por Preço (maior)</option>
            <option value="name">Ordenar por Nome (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <small className="text-muted">
            {isSearching ? "Buscando..." : `Mostrando ${filteredCount} de ${totalCount} propriedades`}
          </small>
          {debouncedSearchTerm && (
            <span className="badge bg-primary-subtle text-primary d-flex align-items-center">
              <i className="fa fa-search me-1"></i>"{debouncedSearchTerm}"
              <button
                className="btn btn-link p-0 ms-1"
                style={{ fontSize: "0.7rem", color: "inherit" }}
                onClick={() => setSearchTerm("")}
                title="Remover busca"
              >
                <i className="fa fa-times"></i>
              </button>
            </span>
          )}
          {sortBy !== "tokens" && (
             <span className="badge bg-info-subtle text-info d-flex align-items-center">
              <i className="fa fa-sort me-1"></i>
              {sortBy === "price" ? "Maior Preço" : "Nome A-Z"}
              <button
                className="btn btn-link p-0 ms-1"
                style={{ fontSize: "0.7rem", color: "inherit" }}
                onClick={() => setSortBy("tokens")}
                title="Resetar ordenação"
              >
                <i className="fa fa-times"></i>
              </button>
            </span>
          )}
        </div>
        {filtersActive && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={clearFilters}
            title="Limpar todos os filtros"
          >
            <i className="fa fa-times me-1"></i>
            Limpar Tudo
          </button>
        )}
      </div>
    </>
  );
}