import { useEffect, useState } from 'react';
import { getOnePropertie } from '@/services/properties/getOnePropertie';
import { getP2pListings } from '@/services/p2p/getP2pListings';
import { postP2pTransactions } from '@/services/p2p/postP2pTransactions';
import { toast } from 'react-toastify';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import { OfferCardSkeleton } from '@/components/Skeleton/Skeleton';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/p2p-offers.css';

export default function OfertasP2PPage() {
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Propiedades, setPropiedades] = useState({});
  const [buyingOffers, setBuyingOffers] = useState(new Set());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        const res = await getP2pListings();
        const ofertasList = res.data || res || [];
        console.log('Ofertas recebidas:', ofertasList);
        console.log('Estrutura da resposta:', res);
        
        if (!Array.isArray(ofertasList)) {
          console.error('Dados recebidos não são um array:', ofertasList);
          setError('Formato de dados inválido recebido do servidor.');
          return;
        } 
        
        const imovelIds = [...new Set(ofertasList.map(o => o.id_imovel))];
        const PropiedadesDetalhes = {};
        
        await Promise.all(imovelIds.map(async (id) => {
          try {
            const res = await getOnePropertie(id);
            PropiedadesDetalhes[id] = res;
          } catch (error) {
            console.error(`Erro ao buscar imóvel ${id}:`, error);
          }
        }));
        
        setPropiedades(PropiedadesDetalhes);
        setOfertas(ofertasList);
        // console.log('UserId atual:', user.id);
        // console.log('Total de ofertas:', ofertasList.length);
      } catch (err) {
        console.error('Erro ao carregar ofertas:', err);
        setError('Erro ao carregar ofertas.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated, user]);

  const handleBuyTokens = async (listing_id) => {
    if (!user || !user.id) {
      toast.warning('Você precisa estar logado para comprar tokens.');
      return;
    }

    setBuyingOffers(prev => new Set([...prev, listing_id]));

    try {
      await postP2pTransactions({ listing_id, comprador_id: user.id });
      toast.success('Compra realizada com sucesso! Os tokens foram adicionados à sua carteira.');
      
      const res = await getP2pListings();
      const ofertasList = res.data || res || [];
      setOfertas(ofertasList);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao processar a compra. Tente novamente.');
    } finally {
      setBuyingOffers(prev => {
        const newSet = new Set(prev);
        newSet.delete(listing_id);
        return newSet;
      });
    }
  };

  const minhasOfertas = ofertas.filter(oferta => oferta.vendedor_id === user?.id);
  const outrasOfertas = ofertas.filter(oferta => oferta.vendedor_id !== user?.id);
  
  // console.log('Minhas ofertas:', minhasOfertas);
  // console.log('Outras ofertas:', outrasOfertas);

  function renderOfertaCard(oferta, isMyOffer = false) {
    const imovel = Propiedades[oferta.id_imovel] || {};
    const totalValue = Number(oferta.valor_unitario) * Number(oferta.qtd_tokens);
    const isActive = oferta.status === 'ativa';
    const isBuying = buyingOffers.has(oferta.id);
    
    return (
      <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
        <div className="position-absolute" style={{ top: '12px', right: '12px', zIndex: 1 }}>
          {isMyOffer && (
            <span className="badge bg-info text-white mb-2 d-block">
              <i className="fa fa-user me-1"></i>Minha Oferta
            </span>
          )}
          <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
            <i className={`fa ${isActive ? 'fa-check-circle' : 'fa-pause-circle'} me-1`}></i>
            {oferta.status.charAt(0).toUpperCase() + oferta.status.slice(1)}
          </span>
        </div>

        <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
          <img
            src={imovel.imagem_url || '/assets/img/default-property.jpg'}
            alt={imovel.titulo || 'Imóvel'}
            className="w-100 h-100 object-fit-cover"
            onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
          />
          <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark p-3">
            <h6 className="text-white mb-1 fw-semibold">
              <i className="fa fa-home me-2"></i>
              {imovel.titulo || 'Imóvel'}
            </h6>
            <small className="text-white-50">
              <i className="fa fa-map-marker-alt me-1"></i>
              {imovel.localizacao || 'Localização não informada'}
            </small>
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Oferta #{oferta.id}</small>
              <small className="badge bg-light text-dark">{oferta.qtd_tokens} tokens</small>
            </div>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="bg-light rounded p-2 text-center">
                  <div className="fw-bold text-primary h6 mb-0">
                    R$ {Number(oferta.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <small className="text-muted">Por token</small>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded p-2 text-center">
                  <div className="fw-bold text-success h6 mb-0">
                    R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <small className="text-muted">Total</small>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
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
                  className={`btn ${isActive ? 'btn-success' : 'btn-secondary'} btn-sm`}
                  onClick={() => handleBuyTokens(oferta.id)}
                  disabled={!isActive || isBuying}
                >
                  {isBuying ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processando...
                    </>
                  ) : (
                    <>
                      <i className={`fa ${isActive ? 'fa-shopping-cart' : 'fa-lock'} me-2`}></i>
                      {isActive ? 'Comprar Agora' : 'Indisponível'}
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

  return (
    <ProtectedRoute>
      <div className="container-fluid py-4">
        <BreadCrumb items={[
          { label: 'P2P', path: '#' },
          { label: 'Ofertas', path: '/p2p/offers' }
        ]} />
        
        {/* Header com estatísticas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="text-2xl mb-2 text-dark fw-bold">
                  <i className="fa fa-handshake me-3 text-dark"></i>
                  Marketplace P2P
                </h1>
                <p className="text-muted mb-0">Compre e venda tokens de imóveis diretamente com outros investidores</p>
              </div>
              <div className="d-flex gap-3">
                <div className="card border-0 bg-light-primary p-3 text-center">
                  <div className="h5 mb-1 text-primary fw-bold">{ofertas.length}</div>
                  <small className="text-muted">Total de Ofertas</small>
                </div>
                <div className="card border-0 bg-light-success p-3 text-center">
                  <div className="h5 mb-1 text-success fw-bold">{outrasOfertas.length}</div>
                  <small className="text-muted">Para Comprar</small>
                </div>
                <div className="card border-0 bg-light-info p-3 text-center">
                  <div className="h5 mb-1 text-info fw-bold">{minhasOfertas.length}</div>
                  <small className="text-muted">Suas Ofertas</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estados de loading e erro */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="text-muted">Carregando ofertas disponíveis...</p>
          </div>
        )}
        
     
        {!loading && !error && (
          <>
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-dark text-white d-flex align-items-center">
                    <i className="fa fa-handshake me-2"></i>
                    <h5 className="mb-0">Ofertas do Marketplace</h5>
                    <span className="badge bg-light text-primary ms-auto">{ofertas.length}</span>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-xl-4 mb-4">
                        <div className="card h-100 border-2 border-dashed border-dark hover-shadow-lg transition-all">
                          <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                            <div className="mb-4">
                              <i className="fa fa-plus-circle fa-4x text-dark opacity-75"></i>
                            </div>
                            <h6 className="text-dark fw-bold mb-2">Criar Nova Oferta</h6>
                            <p className="text-muted mb-4 small">
                              Coloque seus tokens à venda no marketplace P2P
                            </p>
                            <button className="btn btn-dark btn-sm px-4" onClick={() => window.location.href = '/p2p/new_offer'}>
                              <i className="fa fa-plus me-2"></i>
                              Criar Oferta
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Minhas ofertas primeiro */}
                      {minhasOfertas.map(oferta => (
                        <div className="col-md-6 col-xl-4 mb-4" key={oferta.id}>
                          {renderOfertaCard(oferta, true)}
                        </div>
                      ))}

                      {/* Ofertas de outros investidores */}
                      {outrasOfertas.map(oferta => (
                        <div className="col-md-6 col-xl-4 mb-4" key={oferta.id}>
                          {renderOfertaCard(oferta, false)}
                        </div>
                      ))}

                      {/* Mensagem quando não há ofertas */}
                      {ofertas.length === 0 && (
                        <div className="col-12">
                          <div className="text-center py-5">
                            <i className="fa fa-search fa-3x text-muted mb-3"></i>
                            <h6 className="text-muted">Nenhuma oferta disponível no momento</h6>
                            <p className="text-muted">Seja o primeiro a criar uma oferta no marketplace!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}