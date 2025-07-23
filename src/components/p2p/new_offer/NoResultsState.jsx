export default function NoResultsState({ searchTerm, onClearFilters }) {
  return (
    <div className="col-12 text-center py-5">
      <div className="mb-4">
        <i className="fa fa-search-minus text-muted" style={{ fontSize: "4rem" }}></i>
      </div>
      <h3 className="text-muted mb-3">Nenhum resultado encontrado</h3>
      <p className="text-muted mb-4">
        {searchTerm
          ? `Não encontramos propriedades com "${searchTerm}". Tente outros termos.`
          : "Nenhuma propriedade corresponde aos filtros aplicados."}
      </p>
      <button className="btn btn-primary" onClick={onClearFilters}>
        <i className="fa fa-refresh me-2"></i>
        Limpar Filtros
      </button>
    </div>
  );
}