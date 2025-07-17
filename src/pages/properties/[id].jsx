import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FaImage, FaMapMarkerAlt, FaCoins, FaBuilding } from 'react-icons/fa';
//Components
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// sERVICES
import { getOnePropertie } from '@/services/properties/getOnePropertie';
import { getPlatformSettings } from '@/services/platformSettings/getPlatformSettings';
import { postInvestmentsPurchase } from '@/services/investments/postInvestmentsPurchase';

export default function ImovelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState(null);
  const [valorUnitario, setValorUnitario] = useState('');
  const [loading, setLoading] = useState(true);
  const [taxaCompra, setTaxaCompra] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getOnePropertie(id); 
          setProperty(response);

          if (response.total_value && response.total_tokens_original) {
            setValorUnitario((Number(response.total_value) / Number(response.total_tokens_original)).toFixed(2));
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

  useEffect(() => {
    const carousel = document.querySelector('#propertyCarousel');
    if (!carousel) return;

    const handleSlideEnd = (event) => {
      const newIndex = parseInt(event.to);
      if (!isNaN(newIndex)) {
        setActiveImageIndex(newIndex);
      }
    };

    carousel.addEventListener('slid.bs.carousel', handleSlideEnd);
    
    return () => {
      carousel.removeEventListener('slid.bs.carousel', handleSlideEnd);
    };
  }, []);

  useEffect(() => {
    if (property?.photos && property.photos.length > 0) {
      const carouselElement = document.querySelector('#propertyCarousel');
      if (carouselElement && window.bootstrap) {
        setTimeout(() => {
          const existingInstance = window.bootstrap.Carousel.getInstance(carouselElement);
          if (!existingInstance) {
            new window.bootstrap.Carousel(carouselElement, {
              interval: false, 
              wrap: true,
              ride: false
            });
          }
        }, 500);
      }
    }
  }, [property?.photos]);


  const total = Number(amount) * (Number(valorUnitario) || 0);
  const valorTaxa = total * (taxaCompra / 100);
  const totalComTaxa = total + valorTaxa;

  const valorDisponivel = Number(property?.total_tokens || 0) * Number(valorUnitario || 0);
  const valorVendido = (Number(property?.total_tokens_original || 0) - Number(property?.total_tokens || 0)) * Number(valorUnitario || 0);
  const valorMinimo = 0;

  const coresGarantia = ['#e53935', '#f6c244', '#f6e244', '#4fc3f7', '#43a047'];

  // Função para traduzir status
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'active': 'Ativo',
      'inactive': 'Inativo',
      'cancelled': 'Cancelado',
      'completed': 'Concluído',
      'rejected': 'Rejeitado',
      'sold': 'Vendido',
    };
    return statusMap[status?.toLowerCase()] || status?.toUpperCase() || 'N/A';
  };

  const isValid = () => {
    if (property?.status?.toLowerCase() === 'pending') {
      toast.warning('Este imóvel ainda está pendente de aprovação. A compra não está disponível no momento.');
      return false;
    }
    
    if (amount < 1 || isNaN(amount)) {
      toast.warning('Informe uma quantidade válida.');
      return false;
    }
    if (total < valorMinimo) {
      toast.warning(`Valor mínimo de investimento é R$ ${valorMinimo.toLocaleString('pt-BR')}`);
      return false;
    }
    if (Number(amount) > Number(property?.total_tokens || 0)) {
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
        <ProtectedRoute>

    <div className="container-fluid py-5">
        <BreadCrumb items={[
          { label: 'Imóveis', path: '/properties' },
          { label: `Detalhes do imóvel ${property.title}`, path: null }
        ]} />
      <div className="card border-0 shadow-sm p-5 mb-5">
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="mb-4">
              <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                <FaImage className="text-dark" /> Galeria de Imagens
              </h5>
              <div className="panel panel-inverse h-100">
                <div className="panel-body p-3">
                  <div 
                    id="propertyCarousel" 
                    className="carousel slide mb-3" 
                    data-bs-ride="false"
                    data-bs-interval="false"
                    style={{ maxHeight: '450px', overflow: 'hidden' }}
                  >
                    <div className="carousel-inner rounded-3 shadow-sm">
                      {(property.photos && property.photos.length > 0 ? property.photos : [{ path: '/assets/img/default-property.jpg' }]).map((photo, idx) => (
                        <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={photo.id || idx} style={{ height: '450px' }}>
                          <Image
                            src={photo.path || '/assets/img/default-property.jpg'}
                            alt={`Imagem da propriedade ${property.title}`}
                            className="d-block w-100 h-100 object-fit-cover"
                            width={800}
                            height={450}
                            onError={(e) => { e.target.src = '/assets/img/default-property.jpg'; }}
                          />
                        </div>
                      ))}
                    </div>
                    {property.photos && property.photos.length > 1 && (
                      <>
                        <button 
                          className="carousel-control-prev" 
                          type="button" 
                          data-bs-target="#propertyCarousel" 
                          data-bs-slide="prev"
                        >
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Anterior</span>
                        </button>
                        <button 
                          className="carousel-control-next" 
                          type="button" 
                          data-bs-target="#propertyCarousel" 
                          data-bs-slide="next"
                        >
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Próxima</span>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {property.photos && property.photos.length > 1 && (
                    <div className="mt-3">
                      <div className="d-flex gap-2 overflow-auto pb-2">
                        {(property.photos || []).map((img, index) => (
                          <div key={img.id || index} className="flex-shrink-0 position-relative">
                            <Image
                              src={img.path || '/assets/img/default-property.jpg'}
                              alt={`Imagem ${index + 1}`}
                              className={`rounded-2 object-fit-cover transition-all ${
                                activeImageIndex === index 
                                  ? 'border-3 border-primary shadow-lg' 
                                  : 'border border-light opacity-75'
                              }`}
                              style={{ 
                                width: '80px', 
                                height: '60px',
                                transform: activeImageIndex === index ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.3s ease'
                              }}
                              width={80}
                              height={60}
                              onError={(e) => { 
                                e.target.src = '/assets/img/default-property.jpg'; 
                              }}
                            />
                            {activeImageIndex === index && (
                              <div 
                                className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex align-items-center justify-content-center"
                                style={{ 
                                  background: 'rgba(0, 123, 255, 0.2)',
                                  pointerEvents: 'none'
                                }}
                              >
                                <i className="fa fa-check-circle text-primary fs-5 bg-white rounded-circle"></i>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h1 className="h2 fw-bold mb-3 d-flex align-items-center gap-2">
              <FaBuilding className="text-primary" />
              {property.title || 'Título não disponível'}
            </h1>
            
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-info" />
              <span className="text-muted">Localização:</span>
              <span className="fw-semibold">{property.location || 'Não informado'}</span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className={`badge px-3 py-2 ${
                property?.status?.toLowerCase() === 'pending' 
                  ? 'bg-warning-subtle text-warning' 
                  : property?.status?.toLowerCase() === 'active' || property?.status?.toLowerCase() === 'approved'
                  ? 'bg-success-subtle text-success'
                  : 'bg-secondary-subtle text-secondary'
              }`}>
                Status: {translateStatus(property.status)}
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
            
            <p className="mb-4 fs-5 text-primary fw-bold">${property.profitability}</p>

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

            {property.description && (
              <div className="mb-4">
                <h6 className="text-muted mb-2 fw-medium d-flex align-items-center gap-2">
                  <i className="fa fa-align-left"></i> Descrição
                </h6>
                <p className=" text-muted mb-0 ">{property.description}</p>
              </div>
            )}

            <div className="row row-cols-2 g-3 text-muted fs-6 mb-4">
              <div><strong>Valor Total:</strong><br />R$ {Number(property.total_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div><strong>Tokens Originais:</strong><br />{property.total_tokens_original || 0}</div>
              <div><strong>Tokens Disponíveis:</strong><br />{property.total_tokens || 0}</div>
              <div><strong>Valor Unitário:</strong><br />R$ {Number(valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            
              <div><strong>Valor Mínimo:</strong><br />R$ {valorMinimo.toLocaleString('pt-BR')}</div>
              <div><strong>Valor Disponível:</strong><br />R$ {valorDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>

            <p className="mb-1 mt-4 fw-semibold">Progresso do Investimento</p>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>R$ {valorVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>R$ {Number(property.total_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Total</span>
            </div>
            <div className="progress mb-4" style={{ height: 12 }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: property.total_tokens_original > 0 
                    ? `${((Number(property.total_tokens_original || 0) - Number(property.total_tokens || 0)) / Number(property.total_tokens_original || 1)) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>
            
            {property.tokenization_date && (
              <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa fa-calendar text-primary"></i>
                  <span className="text-muted fw-medium">Data de Tokenização</span>
                </div>
                <span className="fw-semibold text-dark">
                  {new Date(property.tokenization_date).toLocaleDateString('pt-BR')}
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
                  max={property.total_tokens || 0}
                  onChange={(e) => setAmount(Number(e.target.value))} 
                />
                <small className="text-muted">Máximo disponível: {property.total_tokens || 0} tokens</small>
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
                disabled={
                  loading || 
                  Number(property.total_tokens || 0) === 0 || 
                  property?.status?.toLowerCase() === 'pending'
                }
              >
                {property?.status?.toLowerCase() === 'pending' 
                  ? 'Aguardando Aprovação' 
                  : Number(property.total_tokens || 0) === 0 
                  ? 'Tokens Esgotados' 
                  : 'Comprar Tokens'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>

  );
}