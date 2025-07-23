
import useDarkMode from '@/hooks/useDarkMode';

export default function PropertyCard({ imovel, onAbrirModal }) {
  const hasTokens = imovel?.qtd_tokens > 0;
	const { isDarkMode } = useDarkMode();

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm h-100 position-relative hover-card p2p-card">
        <div className="position-absolute top-0 end-0 m-2 z-1">
          <span className="badge bg-success">
            <i className="fa fa-cubes me-1"></i>
            {imovel?.qtd_tokens || 0} tokens
          </span>
        </div>

        <div className="position-relative">
          <img
            src={imovel.imagem_url || "/assets/img/default-property.jpg"}
            alt={imovel.titulo}
            className="card-img-top"
            style={{ height: 200, objectFit: "cover" }}
            onError={(e) => { e.target.src = "/assets/img/default-property.jpg"; }}
          />
          <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-top p-3">
            <h2 className="card-title h5 mb-0 text-white text-shadow">
              <i className="fa fa-home me-2"></i>
              {imovel?.titulo || "Imóvel"}
            </h2>
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <p className="text-muted mb-3 small" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {imovel?.descricao || "Sem descrição disponível"}
          </p>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="bg-light rounded p-2 text-center">
                <div className="text-success fw-bold">
                  {(imovel?.valor_unitario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <small className="text-muted">Por token</small>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light rounded p-2 text-center">
                <div className="text-primary fw-bold">
                  {((imovel?.qtd_tokens || 0) * (imovel?.valor_unitario || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <small className="text-muted">Valor total</small>
              </div>
            </div>
          </div>

          <button
            className={`btn ${isDarkMode ? "btn-light" : "btn-dark"} w-100 mt-auto`}
            onClick={() => onAbrirModal(imovel)}
            disabled={!hasTokens}
          >
            <i className="fa fa-store me-2"></i>
            {hasTokens ? "Criar Oferta" : "Sem tokens"}
          </button>
        </div>
      </div>
    </div>
  );
}