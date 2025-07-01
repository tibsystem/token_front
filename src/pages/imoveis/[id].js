import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function ImovelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState(null);
  const [valorUnitario, setValorUnitario] = useState('');
  const [loading, setLoading] = useState(true);
  const [taxaCompra, setTaxaCompra] = useState(0);

  useEffect(() => {
    if (id) {
      api.get(`/properties/${id}`)
        .then((res) => {
          setProperty(res.data);
          // valor unitário calculado com qtd_tokens_original
          if (res.data.valor_total && res.data.qtd_tokens_original) {
            setValorUnitario((Number(res.data.valor_total) / Number(res.data.qtd_tokens_original)).toFixed(2));
          } else {
            setValorUnitario('');
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            if (typeof window !== 'undefined') {
              setError('Sua sessão expirou ou você não tem permissão para acessar este imóvel. Faça login novamente se necessário.');
            }
          } else {
            setError('Erro ao carregar imóvel.');
          }
        })
        .finally(() => setLoading(false));
    }

    // Busca taxa de compra da plataforma
    api.get('/platform-settings')
      .then(res => {
        if (res.data && res.data.taxa_compra_token) {
          setTaxaCompra(Number(res.data.taxa_compra_token));
        }
      })
      .catch(() => setTaxaCompra(0));
  }, [id]);

  const handlePurchase = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let id_investidor = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          id_investidor = payload.id || payload.user_id || payload.sub;
        } catch {}
      }
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const data_compra = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const payload = {
        id_investidor,
        id_imovel: Number(id),
        qtd_tokens: Number(amount),
        valor_unitario: Number(valorUnitario) || 0,
        data_compra,
        origem: 'plataforma',
        status: 'ativo',
      };
      await api.post('/investments/purchase', payload);
      alert('Compra realizada!');
    } catch (error) {
      console.error(error);
      alert('Erro na compra');
    }
  };

  const total = Number(amount) * (Number(valorUnitario) || 0);
  const valorTaxa = total * (taxaCompra / 100);
  const totalComTaxa = total + valorTaxa;

  // Card de informações do investimento (mockado)
  const infoMock = {
    rentabilidade: 'IPCA + 14,00% a.a.',
    vencimento: '15/06/2029',
    nivelGarantia: 5, // de 1 a 5
    vendido: 877000.87,
    total: 2000000,
    devedor: 'Gran Vellas Wins Empreendimentos SPE Ltda.',
    periodicidade: 'Cash Sweep',
    fluxo: 'Cash Sweep',
    garantia: 'Imóveis, Recebíveis, Cotas e Aval',
    lastro: 'Recebíveis Imobiliários',
    cronograma: 'Conforme descrito no Termo de Securitização',
    valorMinimo: 1000,
    valorDisponivel: 1122999.13
  };

  if (loading) return <div className="p-4 text-gray-500 animate-pulse">Carregando imóvel...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!property) return <div className="p-4">Imóvel não encontrado.</div>;

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        {/* Coluna Esquerda: Imagem + Infos */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4">
            <img
              src={property.imagem_url || '/assets/img/default-property.jpg'}
              alt={property.titulo}
              className="card-img-top object-fit-cover"
              style={{ height: 280, objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
              onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
            />
            <div className="card-body">
              <h1 className="card-title h4 mb-2 text-theme"><i className="fa fa-home me-2 text-primary"></i>{property.titulo}</h1>
              <div className="mb-2 text-muted"><i className="fa fa-align-left me-2"></i>{property.descricao}</div>
              <ul className="list-unstyled mb-0">
                <li className="mb-1"><i className="fa fa-map-marker-alt me-2 text-info"></i><b>Localização:</b> {property.localizacao}</li>
                <li className="mb-1"><i className="fa fa-coins me-2 text-warning"></i><b>Valor Total:</b> R$ {Number(property.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
                <li className="mb-1"><i className="fa fa-cubes me-2 text-success"></i><b>Tokens:</b> {property.qtd_tokens}</li>
                <li className="mb-1"><i className="fa fa-check-circle me-2 text-success"></i><b>Status:</b> <span className={`px-2 py-1 rounded text-xs fw-semibold ${property.status === 'ativo' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{property.status}</span></li>
                <li className="mb-1"><i className="fa fa-calendar-alt me-2 text-secondary"></i><b>Data Tokenização:</b> {property.data_tokenizacao}</li>
                {/* Novas informações blockchain */}
                {property.contract_address && (
                  <li className="mb-1 d-flex align-items-center gap-2">
                    <i className="fa fa-link me-2 text-primary"></i>
                    <b>Contrato:</b>
                    <a
                      href={`https://polygonscan.com/token/${property.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-break d-inline-flex align-items-center gap-1"
                      title="Ver no PolygonScan"
                    >
                      {property.contract_address.slice(0, 6)}...{property.contract_address.slice(-4)}
                      <i className="fa fa-external-link-alt ms-1"></i>
                    </a>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 ms-1"
                      title="Copiar endereço"
                      onClick={() => {navigator.clipboard.writeText(property.contract_address)}}
                    >
                      <i className="fa fa-copy"></i>
                    </button>
                  </li>
                )}
                {property.token_symbol && (
                  <li className="mb-1"><i className="fa fa-tag me-2 text-info"></i><b>Símbolo do Token:</b> {property.token_symbol}</li>
                )}
                {property.token_name && (
                  <li className="mb-1"><i className="fa fa-certificate me-2 text-secondary"></i><b>Nome do Token:</b> {property.token_name}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Coluna Direita: Checkout */}
        <div className="col-lg-6">
          {/* Card de informações do investimento */}
          <div className="card border-0 shadow-sm mb-4 p-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
              <div>
                <div className="text-muted small">Rentabilidade Prevista</div>
                <div className="fw-bold fs-4 text-primary">{infoMock.rentabilidade}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Vence em</div>
                <div className="fw-bold fs-5 text-dark">{infoMock.vencimento}</div>
              </div>
            </div>
            <hr className="my-3" />
            {/* Nível de Garantia e Progresso um embaixo do outro */}
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-semibold">Nível de Garantia</span>
                <i className="fa fa-info-circle text-info" title="Nível de proteção do investimento."></i>
              </div>
              <div className="small mb-2">Esse investimento está classificado no <b>Nível {infoMock.nivelGarantia}</b></div>
              {/* Termômetro de nível - barras largas e coloridas */}
              <div className="d-flex align-items-center gap-2 mb-3" style={{minHeight: 32}}>
                {[1,2,3,4,5].map(nivel => {
                  // Cores do perigo ao confiável
                  const cores = ['#e53935', '#f6c244', '#f6e244', '#4fc3f7', '#43a047'];
                  return (
                    <div key={nivel} className="d-flex flex-column align-items-center" style={{flex:1}}>
                      <div
                        style={{
                          width: 100,
                          height: 6,
                          borderRadius: 6,
                          background: cores[nivel-1],
                          opacity: nivel === infoMock.nivelGarantia ? 1 : 0.5,
                          position: 'relative',
                          marginBottom: 2,
                          boxShadow: nivel === infoMock.nivelGarantia ? '0 0 0 2px #2563eb55' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {nivel === infoMock.nivelGarantia && (
                          <span style={{position:'absolute',top:-22,left:'50%',transform:'translateX(-50%)',fontSize:20,color:'#2563eb'}}>
                            <i className="fa fa-location-pin"></i>
                          </span>
                        )}
                      </div>
                      <div className="small text-muted" style={{fontSize:11}}>{nivel === 1 ? '' : nivel === 5 ? '' : ''}</div>
                    </div>
                  );
                })}
              </div>
              {/* Progresso */}
              <div className="fw-semibold mb-1">Progresso</div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-bold text-primary">R$ {infoMock.vendido.toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                <span className="small text-muted">Vendido</span>
              </div>
              <div className="progress" style={{height:6, background:'#e5e7eb'}}>
                <div
                  className="progress-bar bg-primary"
                  style={{width: `${(infoMock.vendido/infoMock.total)*100}%`}}
                  role="progressbar"
                  aria-valuenow={infoMock.vendido}
                  aria-valuemin={0}
                  aria-valuemax={infoMock.total}
                ></div>
              </div>
              <div className="d-flex justify-content-between small mt-1">
                <span className="text-muted">R$ {infoMock.vendido.toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                <span className="text-muted">R$ {infoMock.total.toLocaleString('pt-BR', {minimumFractionDigits:2})} Total</span>
              </div>
            </div>
            <div className="row g-0 mt-3">
              <div className="col-12">
                <div className="table-responsive">
                  
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h5 mb-4"><i className="fa fa-shopping-cart me-2 text-success"></i>Comprar tokens deste imóvel</h2>
            <div className="row mb-3 g-2 align-items-end">
              <div className="col-6">
                <label className="form-label fw-semibold">Quantidade de tokens</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: 180 }}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold">Valor unitário (R$)</label>
                <div className="form-control bg-light" style={{ maxWidth: 180 }}>
                  R$ {Number(valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Total</label>
              <div className="fs-5 fw-bold text-theme">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="small text-muted">Taxa da transação ({taxaCompra.toLocaleString('pt-BR', {minimumFractionDigits:2})}%): <b>R$ {valorTaxa.toLocaleString('pt-BR', {minimumFractionDigits:2})}</b></div>
              <div className="small text-dark mt-1">Total com taxa: <b>R$ {totalComTaxa.toLocaleString('pt-BR', {minimumFractionDigits:2})}</b></div>
            </div>
            <button
              onClick={handlePurchase}
              className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 py-2 fs-5"
            >
              <i className="fa fa-credit-card"></i> Comprar Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
