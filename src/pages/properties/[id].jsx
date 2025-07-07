import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getOnePropertie } from '../../services/properties/getOnePropertie';
import { getPlatformSettings } from '../../services/platformSettings/getPlatformSettings';
import { postInvestmentsPurchase } from '../../services/investments/postInvestmentsPurchase';
import { toast } from 'react-toastify';
import { FaImage, FaMapMarkerAlt, FaCoins, FaBuilding } from 'react-icons/fa';

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
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getOnePropertie(id); 
          setProperty(response);

          if (response.valor_total && response.qtd_tokens_original) {
            setValorUnitario((Number(response.valor_total) / Number(response.qtd_tokens_original)).toFixed(2));
          } else {
            setValorUnitario('');
          }
        } catch (err) {
          if (err?.response?.status === 401) {
            toast.error('Sua sessão expirou ou você não tem permissão para acessar este imóvel. Faça login novamente se necessário.');
          } else {
            setError('Erro ao carregar imóvel.');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await getPlatformSettings();
        if (response && response.taxa_compra_token) {
          setTaxaCompra(Number(response.taxa_compra_token));
        }
      } catch {
        setTaxaCompra(0);
      }
    };

    fetchData();
    fetchSettings();
  }, [id]);


  const total = Number(amount) * (Number(valorUnitario) || 0);
  const valorTaxa = total * (taxaCompra / 100);
  const totalComTaxa = total + valorTaxa;

  const valorDisponivel = Number(property?.qtd_tokens || 0) * Number(valorUnitario || 0);
  const valorVendido = (Number(property?.qtd_tokens_original || 0) - Number(property?.qtd_tokens || 0)) * Number(valorUnitario || 0);
  const valorMinimo = 1000;

  const coresGarantia = ['#e53935', '#f6c244', '#f6e244', '#4fc3f7', '#43a047'];

  const isValid = () => {
    if (amount < 1 || isNaN(amount)) {
      toast.warning('Informe uma quantidade válida.');
      return false;
    }
    if (total < valorMinimo) {
      toast.warning(`Valor mínimo de investimento é R$ ${valorMinimo.toLocaleString('pt-BR')}`);
      return false;
    }
    if (Number(amount) > Number(property?.qtd_tokens || 0)) {
      toast.warning('A quantidade excede os tokens disponíveis para este imóvel.');
      return false;
    }
    return true;
  };

  const handlePurchase = async () => {
    if (!isValid()) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let id_investidor = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          id_investidor = payload.id || payload.user_id || payload.sub;
        } catch { }
      }
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const data_compra = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const payload = {
        id_investidor,
        id_imovel: Number(id),
        qtd_tokens: Number(amount),
        valor_unitario: Number(valorUnitario) || 0,
        data_compra,
        origem: 'plataforma',
        status: 'ativo',
      };
      await postInvestmentsPurchase(payload);
      toast.success('Compra realizada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro na compra');
    }
  };

  if (loading) return <div className="p-5 text-muted fs-5 text-center">Carregando imóvel...</div>;
  if (error) return <div className="p-5 text-danger fs-5 text-center">{error}</div>;
  if (!property) return <div className="p-5 text-center">Imóvel não encontrado.</div>;

  return (
    <div className="container-fluid py-5">
      <div className="card border-0 shadow-sm p-5 mb-5">
        <div className="row g-5">
          <div className="col-lg-7">
            {/* Galeria de Imagens */}
            <div className="mb-4">
              <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                <FaImage className="text-primary" /> Galeria de Imagens
              </h5>
              <div className="position-relative overflow-hidden rounded-3 shadow-sm" style={{ height: '300px' }}>
                {property.imagens && property.imagens.length > 0 ? (
                  <Image
                    src={property.imagens[0]?.url || '/assets/img/default-property.jpg'}
                    alt={`Imagem da propriedade ${property.titulo}`}
                    className="w-100 h-100 object-fit-cover"
                    width={800}
                    height={300}
                    onError={(e) => { 
                      e.target.src = '/assets/img/default-property.jpg'; 
                    }}
                  />
                ) : (
                  <>
                    <Image
                      src="/assets/img/default-property.jpg"
                      alt="Imagem padrão da propriedade"
                      className="w-100 h-100 object-fit-cover opacity-75"
                      width={800}
                      height={300}
                    />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div className="bg-white bg-opacity-90 rounded-3 p-4 shadow">
                        <FaImage size={48} className="text-muted mb-2" />
                        <p className="text-muted mb-0 fw-medium">Imagem não disponível</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {property.imagens && property.imagens.length > 1 && (
                <div className="mt-3">
                  <div className="d-flex gap-2 overflow-auto pb-2">
                    {property.imagens.slice(1, 5).map((img, index) => (
                      <div key={index} className="flex-shrink-0">
                        <Image
                          src={img.url || '/assets/img/default-property.jpg'}
                          alt={`Imagem adicional ${index + 2}`}
                          className="rounded-2 object-fit-cover border"
                          style={{ width: '80px', height: '60px' }}
                          width={80}
                          height={60}
                          onError={(e) => { 
                            e.target.src = '/assets/img/default-property.jpg'; 
                          }}
                        />
                      </div>
                    ))}
                    {property.imagens.length > 5 && (
                      <div className="flex-shrink-0 d-flex align-items-center justify-content-center bg-light rounded-2 border text-muted" 
                           style={{ width: '80px', height: '60px', fontSize: '12px' }}>
                        +{property.imagens.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <h1 className="h2 fw-bold mb-3 d-flex align-items-center gap-2">
              <FaBuilding className="text-primary" />
              {property.titulo || 'Título não disponível'}
            </h1>
            
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-info" />
              <span className="text-muted">Localização:</span>
              <span className="fw-semibold">{property.localizacao || 'Não informado'}</span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                Status: {property.status?.toUpperCase() || 'N/A'}
              </span>
              <span className="badge bg-primary-subtle text-primary px-3 py-2">Isento de IR</span>

              {property?.contract_address && (
                <a
                  href={`https://polygonscan.com/token/${property.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge bg-warning-subtle text-secondary px-3 py-2 text-decoration-none d-inline-flex align-items-center"
                  title="Ver contrato no PolygonScan"
                >
                  <i className="fa fa-link me-1"></i> Contrato
                </a>
              )}
            </div>
            
            <p className="mb-4 fs-5 text-primary fw-bold">Rentabilidade Prevista: IPCA + 14,00% a.a.</p>

            <p className="mb-2 fw-semibold">Nível de Garantia</p>
            <p className="text-muted mb-2">Esse investimento está classificado no <strong>Nível 5</strong></p>
            <div className="d-flex gap-2 mb-4 align-items-end">
              {[1, 2, 3, 4, 5].map((nivel, idx) => (
                <div key={nivel} className="text-center flex-fill">
                  <div style={{ fontSize: 12, color: coresGarantia[idx], opacity: nivel === 5 ? 1 : 0.3, fontWeight: 'bold' }}>Nível {nivel}</div>
                  <div
                    className="rounded-pill mt-1"
                    style={{ height: 10, backgroundColor: coresGarantia[idx], opacity: nivel === 5 ? 1 : 0.3 }}
                  ></div>
                </div>
              ))}
            </div>

            {property.descricao && (
              <div className="p-3 bg-light rounded-3 mb-4">
                <h6 className="text-muted mb-2 fw-medium d-flex align-items-center gap-2">
                  <i className="fa fa-align-left"></i> Descrição
                </h6>
                <p className="small text-muted mb-0 lh-base">{property.descricao}</p>
              </div>
            )}

            <div className="row row-cols-2 g-3 text-muted fs-6 mb-4">
              <div><strong>Valor Total:</strong><br />R$ {Number(property.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div><strong>Tokens Originais:</strong><br />{property.qtd_tokens_original || 0}</div>
              <div><strong>Tokens Disponíveis:</strong><br />{property.qtd_tokens || 0}</div>
              <div><strong>Valor Unitário:</strong><br />R$ {Number(valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div><strong>Devedor:</strong><br />Gran Vellas Wins Empreendimentos SPE Ltda.</div>
              <div><strong>Periodicidade da Remuneração:</strong><br />Cash Sweep</div>
              <div><strong>Fluxo de Amortização:</strong><br />Cash Sweep</div>
              <div><strong>Garantia:</strong><br />Imóveis, Recebíveis, Cotas e Aval</div>
              <div><strong>Lastro:</strong><br />Recebíveis Imobiliários</div>
              <div><strong>Cronograma:</strong><br />Conforme descrito no Termo de Securitização</div>
              <div><strong>Valor Mínimo:</strong><br />R$ {valorMinimo.toLocaleString('pt-BR')}</div>
              <div><strong>Valor Disponível:</strong><br />R$ {valorDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>

            <p className="mb-1 mt-4 fw-semibold">Progresso do Investimento</p>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>R$ {valorVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>R$ {Number(property.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Total</span>
            </div>
            <div className="progress mb-4" style={{ height: 12 }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: property.qtd_tokens_original > 0 
                    ? `${((Number(property.qtd_tokens_original || 0) - Number(property.qtd_tokens || 0)) / Number(property.qtd_tokens_original || 1)) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>
            
            {property.data_tokenizacao && (
              <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-calendar text-primary"></i>
                  <span className="text-muted fw-medium">Data de Tokenização</span>
                </div>
                <span className="fw-semibold text-dark">
                  {new Date(property.data_tokenizacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FaCoins className="text-warning" />
                Simule seu investimento
              </h4>
              <div className="mb-3">
                <label className="form-label">Quantidade de tokens</label>
                <input 
                  type="number" 
                  className="form-control form-control-lg" 
                  value={amount} 
                  min={1} 
                  max={property.qtd_tokens || 0}
                  onChange={(e) => setAmount(Number(e.target.value))} 
                />
                <small className="text-muted">Máximo disponível: {property.qtd_tokens || 0} tokens</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Valor unitário</label>
                <div className="form-control form-control-lg bg-light">R$ {Number(valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Taxa da plataforma: {taxaCompra}%</div>
                <div className="fw-semibold">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="text-muted">Taxa: R$ {valorTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="fw-bold text-success">Total com taxa: R$ {totalComTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <button 
                className="btn btn-success w-100 py-2 fs-5" 
                onClick={handlePurchase} 
                disabled={loading || Number(property.qtd_tokens || 0) === 0}
              >
                {Number(property.qtd_tokens || 0) === 0 ? 'Tokens Esgotados' : 'Comprar Tokens'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}