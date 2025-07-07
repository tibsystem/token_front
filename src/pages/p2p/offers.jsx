import { useEffect, useState } from 'react';
import { getOnePropertie } from '@/services/properties/getOnePropertie';
import { getP2pListings } from '@/services/p2p/getP2pListings';
import { postP2pTransactions } from '@/services/p2p/postP2pTransactions';
import { toast } from 'react-toastify';

export default function OfertasP2PPage() {
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [imoveis, setImoveis] = useState({});

  function getUserIdFromToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id || payload.user_id || payload.sub || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      const uid = getUserIdFromToken();
      setUserId(uid);
      try {
        const res = await getP2pListings();
        const ofertasList = res.data?.data || [];
        console.log('Ofertas recebidas:', ofertasList); // Debug
        
        const imovelIds = [...new Set(ofertasList.map(o => o.id_imovel))];
        const imoveisDetalhes = {};
        
        await Promise.all(imovelIds.map(async (id) => {
          try {
            const res = await getOnePropertie(id);
            imoveisDetalhes[id] = res;
          } catch (error) {
            console.error(`Erro ao buscar imóvel ${id}:`, error);
          }
        }));
        
        setImoveis(imoveisDetalhes);
        setOfertas(ofertasList);
      } catch (err) {
        console.error('Erro ao carregar ofertas:', err);
        setError('Erro ao carregar ofertas.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBuyTokens = async (listing_id) => {
    try {
      if (!userId) {
        toast.warning('Você precisa estar logado para comprar tokens.');
        return;
      }
      await postP2pTransactions({ listing_id, comprador_id: userId });
      toast.success('Compra realizada com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao comprar tokens.');
    }
  };

  const minhasOfertas = []; 
  const outrasOfertas = ofertas;

  function renderOfertaCard(oferta, isMyOffer = false) {
    const imovel = imoveis[oferta.id_imovel] || {};
    return (
      <div key={oferta.id} className="card border-0 shadow-sm mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <img
              src={imovel.imagem_url || '/assets/img/default-property.jpg'}
              alt={imovel.titulo || 'Imóvel'}
              className="img-fluid rounded-start"
              style={{ height: 120, objectFit: 'cover', width: '100%' }}
              onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title h6 mb-1 text-theme"><i className="fa fa-home me-2 text-primary"></i>{imovel.titulo || 'Imóvel'}</h2>
              <div className="mb-1 text-muted"><i className="fa fa-map-marker-alt me-2"></i>{imovel.localizacao || '-'}</div>
              <div className="mb-1"><b>Oferta #{oferta.id}</b></div>
              <div className="mb-1"><b>Tokens à venda:</b> {oferta.qtd_tokens}</div>
              <div className="mb-1"><b>Valor unitário da oferta:</b> R$ {Number(oferta.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="mb-1"><b>Total:</b> R$ {(Number(oferta.valor_unitario) * Number(oferta.qtd_tokens)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="mb-1"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs fw-semibold ${oferta.status === 'ativa' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{oferta.status}</span></div>
              {isMyOffer ? (
                <span className="badge bg-info mt-2">Minha oferta</span>
              ) : (
                <button
                  className="btn btn-success mt-2"
                  onClick={() => handleBuyTokens(oferta.id)}
                  disabled={oferta.status !== 'ativa'}
                >
                  <i className="fa fa-credit-card me-2"></i>Comprar oferta total
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-4">
      <h1 className="text-3xl font-bold mb-6 text-dark">Ofertas P2P Disponíveis</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando ofertas...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {/* Debug info */}
      {!loading && (
        <div className="alert alert-info mb-4">
          <small>Total de ofertas carregadas: {ofertas.length}</small>
        </div>
      )}
      
      <h2 className="h5 mb-3 text-primary">Minhas ofertas</h2>
      {minhasOfertas.length === 0 && <div className="text-muted mb-4">Você não possui ofertas ativas.</div>}
      <div className="row">
        {minhasOfertas.map(oferta => (
          <div className="col-md-6 col-lg-4" key={oferta.id}>
            {renderOfertaCard(oferta, true)}
          </div>
        ))}
      </div>
      <h2 className="h5 mt-5 mb-3 text-success">Ofertas de outros investidores</h2>
      {outrasOfertas.length === 0 && <div className="text-muted mb-4">Nenhuma oferta de outros investidores disponível.</div>}
      <div className="row">
        {outrasOfertas.map(oferta => (
          <div className="col-md-6 col-lg-4" key={oferta.id}>
            {renderOfertaCard(oferta, false)}
          </div>
        ))}
      </div>
    </div>
  );
}
