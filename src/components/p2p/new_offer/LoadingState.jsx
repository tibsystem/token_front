export default function LoadingState() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-dark mb-3" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
      <div className="text-muted">Carregando seus investimentos...</div>
    </div>
  );
}