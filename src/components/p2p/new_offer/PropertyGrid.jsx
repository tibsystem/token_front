import PropertyCard from "./PropertyCard";
import NoResultsState from "./NoResultsState";

export default function PropertyGrid({ propriedades, onAbrirModal, searchTerm, onClearFilters }) {
  if (propriedades.length === 0) {
    return <NoResultsState searchTerm={searchTerm} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="row g-4">
      {propriedades.map((imovel) => (
        <PropertyCard key={imovel.id} imovel={imovel} onAbrirModal={onAbrirModal} />
      ))}
    </div>
  );
}