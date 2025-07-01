import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function NovaOfertaPage() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImovel, setModalImovel] = useState(null);
  const [qtdVenda, setQtdVenda] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    async function fetchImoveis() {
      setLoading(true);
      setError(null);
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('ID do usuário não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }
      try {
        // Busca os investimentos do usuário
        const res = await api.get(`/investments/${userId}`);
        const investimentos = Array.isArray(res.data) ? res.data : [res.data];
        // Busca detalhes dos imóveis
        const imoveisDetalhados = await Promise.all(
          investimentos.map(async (inv) => {
            const propRes = await api.get(`/properties/${inv.id_imovel}`);
            return {
              ...propRes.data,
              qtd_tokens: inv.qtd_tokens,
              valor_unitario: inv.valor_unitario,
              investimento_id: inv.id
            };
          })
        );
        setImoveis(imoveisDetalhados);
      } catch (e) {
        setError('Erro ao carregar imóveis.');
      } finally {
        setLoading(false);
      }
    }
    fetchImoveis();
  }, []);

  const abrirModal = (imovel) => {
    setModalImovel(imovel);
    setQtdVenda('');
    setPrecoVenda(imovel.valor_unitario);
  };

  const fecharModal = () => {
    setModalImovel(null);
    setQtdVenda('');
    setPrecoVenda('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qtdVenda || !precoVenda || Number(qtdVenda) < 1) return;
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let vendedor_id = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          vendedor_id = payload.id || payload.user_id || payload.sub;
        } catch {}
      }
      const payload = {
        vendedor_id,
        id_imovel: modalImovel.id,
        qtd_tokens: Number(qtdVenda),
        valor_unitario: Number(precoVenda)
      };
      await api.post('/p2p/listings', payload);
      fecharModal();
      alert('Oferta criada com sucesso!');
    } catch (error) {
      setError('Erro ao criar oferta');
      alert('Erro ao criar oferta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-4 text-theme">Vender Tokens</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando imóveis...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="row g-4">
        {imoveis.length === 0 && !loading && (
          <div className="col-12 text-muted">Você não possui tokens para vender.</div>
        )}
        {imoveis.map((imovel) => (
          <div className="col-md-6 col-lg-4" key={imovel.id}>
            <div className="card border-0 shadow-sm h-100">
              <img
                src={imovel.imagem_url || '/assets/img/default-property.jpg'}
                alt={imovel.titulo}
                className="card-img-top object-fit-cover"
                style={{ height: 180, objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
              />
              <div className="card-body">
                <h2 className="card-title h5 mb-2 text-theme"><i className="fa fa-home me-2 text-primary"></i>{imovel.titulo}</h2>
                <div className="mb-2 text-muted"><i className="fa fa-align-left me-2"></i>{imovel.descricao}</div>
                <ul className="list-unstyled mb-2">
                  <li className="mb-1"><i className="fa fa-cubes me-2 text-success"></i><b>Tokens disponíveis:</b> {imovel.qtd_tokens}</li>
                  <li className="mb-1"><i className="fa fa-coins me-2 text-warning"></i><b>Valor unitário:</b> R$ {Number(imovel.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
                </ul>
                <button className="btn btn-outline-primary w-100" onClick={() => abrirModal(imovel)}>
                  <i className="fa fa-arrow-up me-2"></i>Vender
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de venda */}
      {modalImovel && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vender tokens de {modalImovel.titulo}</h5>
                <button type="button" className="btn-close" onClick={fecharModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Quantidade de tokens</label>
                    <input
                      type="number"
                      min="1"
                      max={modalImovel.qtd_tokens}
                      value={qtdVenda}
                      onChange={e => setQtdVenda(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Preço por token (R$)</label>
                    <input
                      type="number"
                      min="0"
                      value={precoVenda}
                      onChange={e => setPrecoVenda(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={fecharModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <i className="fa fa-arrow-up me-2"></i>Confirmar Venda
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
