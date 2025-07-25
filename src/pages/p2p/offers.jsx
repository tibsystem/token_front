import { useState, useMemo } from "react";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// components
import OfferFilters from "@/components/p2p/offer/FilterOffers";
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
//utils
import { getUserIdFromToken } from "@/utils/auth";

//services
import { getOnePropertie } from "@/services/properties/getOnePropertie";
import { getP2pListings } from "@/services/p2p/getP2pListings";
import { postP2pTransactions } from "@/services/p2p/postP2pTransactions";

// hooks
import useDarkMode from '@/hooks/useDarkMode';


export default function OffersPage() {
  const [buyingOffers, setBuyingOffers] = useState(new Set());
  const [filters, setFilters] = useState({ searchTerm: '', sortBy: 'recent' });
  const { isDarkMode } = useDarkMode();
   const textClass = isDarkMode ? "text-white" : "text-dark";
  const user = getUserIdFromToken();
  const {
    data: ofertas = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["p2pListings"],
    queryFn: async () => {
      const res = await getP2pListings();
      const ofertasList = res.data || res || [];
      if (!Array.isArray(ofertasList))
        throw new Error("Formato de dados inválido recebido do servidor.");
      return ofertasList;
    },
  });

  
  const { data: Propiedades = {} } = useQuery({
    queryKey: ["p2pProperties", ofertas],
    queryFn: async () => {
      const imovelIds = [...new Set(ofertas.map((o) => o.id_imovel))];
      const detalhes = {};
      await Promise.all(
        imovelIds.map(async (id) => {
          try {
            const res = await getOnePropertie(id);
            detalhes[id] = res;
          } catch (error) {
            console.error(`Erro ao buscar imóvel ${id}:`, error);
          }
        })
      );
      return detalhes;
    },
    enabled: ofertas.length > 0,
  });

  const handleBuyTokens = async (listing_id) => {
    if (!user || !user.id) {
      toast.warning("Você precisa estar logado para comprar tokens.");
      return;
    }
    setBuyingOffers((prev) => new Set([...prev, listing_id]));
    try {
      await postP2pTransactions({ listing_id, comprador_id: user.id });
      toast.success(
        "Compra realizada com sucesso! Os tokens foram adicionados à sua carteira."
      );

      const res = await getP2pListings();
      const ofertasList = res.data || res || [];
      setOfertas(ofertasList);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar a compra. Tente novamente.");
    } finally {
      setBuyingOffers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(listing_id);
        return newSet;
      });
    }
  };

  const minhasOfertas = useMemo(
    () => ofertas.filter((oferta) => oferta.vendedor_id === user?.id),
    [ofertas, user]
  );
  const outrasOfertas = useMemo(
    () => ofertas.filter((oferta) => oferta.vendedor_id !== user?.id),
    [ofertas, user]
  );

  // console.log('Minhas ofertas:', minhasOfertas);
  // console.log('Outras ofertas:', outrasOfertas);

  function renderOfertaCard(oferta, isMyOffer = false) {
    const imovel = Propiedades[oferta.id_imovel] || {};
    const totalValue =
      Number(oferta.valor_unitario) * Number(oferta.qtd_tokens);
    const isActive = oferta.status === "ativa";
    const isBuying = buyingOffers.has(oferta.id);

    return (
      <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
        <div
          className="position-absolute"
          style={{ top: "12px", right: "12px", zIndex: 1 }}
        >
          {isMyOffer && (
            <span className="badge bg-info text-white mb-2 d-block">
              <i className="fa fa-user me-1"></i>Minha Oferta
            </span>
          )}
          <span className={`badge ${isActive ? "bg-success" : "bg-secondary"}`}>
            <i
              className={`fa ${
                isActive ? "fa-check-circle" : "fa-pause-circle"
              } me-1`}
            ></i>
            {oferta.status.charAt(0).toUpperCase() + oferta.status.slice(1)}
          </span>
        </div>

        <div
          className="position-relative overflow-hidden"
          style={{ height: "200px" }}
        >
          <img
            src={imovel.imagem_url || "/assets/img/default-property.jpg"}
            alt={imovel.titulo || "Imóvel"}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.src = "/assets/img/default-property.jpg";
            }}
          />
          <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark p-3">
            <h6 className="text-white mb-1 fw-semibold">
              <i className="fa fa-home me-2"></i>
              {imovel.titulo || "Imóvel"}
            </h6>
            <small className="text-white-50">
              <i className="fa fa-map-marker-alt me-1"></i>
              {imovel.localizacao || "Localização não informada"}
            </small>
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Oferta #{oferta.id}</small>
              <small className="badge bg-light text-dark">
                {oferta.qtd_tokens} tokens
              </small>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="bg-light rounded p-2 text-center">
                  <div className="fw-bold text-primary h6 mb-0">
                    R${" "}
                    {Number(oferta.valor_unitario).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <small className="text-muted">Por token</small>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded p-2 text-center">
                  <div className="fw-bold text-success h6 mb-0">
                    R${" "}
                    {totalValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <small className="text-muted">Total</small>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {isMyOffer ? (
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm" disabled>
                  <i className="fa fa-eye me-2"></i>Gerenciar Oferta
                </button>
                <small className="text-center text-muted">
                  <i className="fa fa-info-circle me-1"></i>
                  Aguardando compradores
                </small>
              </div>
            ) : (
              <div className="d-grid">
                <button
                  className={`btn ${
                    isActive ? "btn-success" : "btn-secondary"
                  } btn-sm`}
                  onClick={() => handleBuyTokens(oferta.id)}
                  disabled={!isActive || isBuying}
                >
                  {isBuying ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      <i
                        className={`fa ${
                          isActive ? "fa-shopping-cart" : "fa-lock"
                        } me-2`}
                      ></i>
                      {isActive ? "Comprar Agora" : "Indisponível"}
                    </>
                  )}
                </button>
                {isActive && !isBuying && (
                  <small className="text-center text-muted mt-1">
                    <i className="fa fa-shield-alt me-1"></i>
                    Transação segura
                  </small>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  const filteredAndSortedOffers = useMemo(() => {
    let processadas = ofertas.map(oferta => ({
      ...oferta,
      imovel: Propiedades[oferta.id_imovel] || {},
      totalValue: Number(oferta.valor_unitario) * Number(oferta.qtd_tokens)
    }));
       if (filters.searchTerm) {
      processadas = processadas.filter(oferta =>
        oferta.imovel.titulo?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    switch (filters.sortBy) {
      case 'price_high':
        processadas.sort((a, b) => b.totalValue - a.totalValue);
        break;
      case 'price_low':
        processadas.sort((a, b) => a.totalValue - b.totalValue);
        break;
      case 'tokens_high':
        processadas.sort((a, b) => b.qtd_tokens - a.qtd_tokens);
        break;
      case 'tokens_low':
        processadas.sort((a, b) => a.qtd_tokens - b.qtd_tokens);
        break;
      case 'recent':
      default:
        processadas.sort((a, b) => b.id - a.id);
        break;
    }

    return processadas;
  }, [ofertas, Propiedades, filters]);

  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="container-fluid py-4">
      <BreadCrumb
        items={[
          { label: "P2P", path: null },
          { label: "Ofertas", path: "/p2p/offers" },
        ]}
      />

      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <h1 className={`text-2xl mb-1 ${textClass} fw-bold`}>Marketplace P2P</h1>
          <p className="text-muted mb-0">
            Compre e venda tokens de imóveis diretamente com outros
            investidores.
          </p>
        </div>
        <button
          className="btn btn-dark btn-lg px-4"
          onClick={() => (window.location.href = "/p2p/new_offer")}
        >
          <i className="fa fa-plus me-2"></i>
          Criar Nova Oferta
        </button>
      </div>
       <OfferFilters onFilterChange={handleFilterChange} />

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando ofertas disponíveis...</p>
        </div>
      )}     


      {!loading && !error && (
        <>
          <div className="row g-4">
            {[...outrasOfertas, ...minhasOfertas].length === 0 && (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="fa fa-search fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">
                    Nenhuma oferta disponível no momento.
                  </h6>
                  <p className="text-muted small">
                    Seja o primeiro a criar uma oferta no marketplace!
                  </p>
                </div>
              </div>
            )}
            {[...outrasOfertas, ...minhasOfertas].map((oferta) => (
              <div className="col-md-6 col-xl-4" key={oferta.id}>
                {renderOfertaCard(oferta, oferta.vendedor_id === user?.id)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
