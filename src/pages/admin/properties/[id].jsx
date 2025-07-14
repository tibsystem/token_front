import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Sidebar from '@/components/sidebar/sidebar';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import { FaCoins, FaUsers, FaCubes, FaCheckCircle, FaUser, FaMapMarkerAlt, FaImage,FaBuilding } from 'react-icons/fa';
import { getPropertyFinance } from '@/services/propertyFinance/getPropertyFinance';
import { getOnePropertie } from '@/services/properties/getOnePropertie';
import { putPropertie } from '@/services/properties/putPropertie';
import { deletePropertie } from '@/services/properties/deletePropertie';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomModal from '@/components/modal/Modal';
import { toast } from 'react-toastify';

export default function ImovelAdminFinanceiro() {
  const router = useRouter();
  const { id } = router.query;
  const [dados, setDados] = useState(null);
  const [aba, setAba] = useState('financeiro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    location: '',
    total_value: '',
    total_tokens: '',
    status: ''
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [responseFinance, responseProperty] = await Promise.all([
          getPropertyFinance(id),
          getOnePropertie(id)
        ]);
        setDados({ ...responseFinance, property: responseProperty });
      } catch (err) {
        if (err?.response?.status === 401) {
          setError('Sua sessão expirou ou você não tem permissão para acessar os dados financeiros deste imóvel. Faça login novamente se necessário.');
        } else {
          setError('Erro ao carregar dados financeiros do imóvel.');
          console.error('Erro ao carregar dados financeiros do imóvel:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEditClick = () => {
    if (dados?.property) {
      setEditFormData({
        title: dados.property.title || '',
        description: dados.property.description || '',
        location: dados.property.location || '',
        total_value: dados.property.total_value || '',
        total_tokens: dados.property.total_tokens || '',
        status: dados.property.status || ''
      });
      setShowEditModal(true);
    }
  };
  const handleDelete = async () => {
    setShowDeleteModal(false);
    
    try {
      setLoading(true);
      await deletePropertie(id);
      toast.success('Propriedade excluída com sucesso!');
      router.push('/admin/properties'); 
    } catch (err) {
      console.error('Erro ao excluir propriedade:', err);
      toast.error('Erro ao excluir propriedade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    
    try {
      setLoading(true);
      await putPropertie(id, editFormData);
      
      const [responseFinance, responseProperty] = await Promise.all([
        getPropertyFinance(id),
        getOnePropertie(id)
      ]);
      setDados({ ...responseFinance, property: responseProperty });
      
      setShowEditModal(false);
      toast.success('Propriedade atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar propriedade:', err);
      toast.error('Erro ao atualizar propriedade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!dados) return <div className="p-4">Dados não encontrados.</div>;

  const { imovel, resumo, investidores, investimentos, transacoes_p2p } = dados;

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-50">
     <main className="flex-1 p-8 max-w-6xl mx-auto">
        <Breadcrumb items={[
          { label: 'Imóveis', path: '/admin/properties' },
          { label: `Detalhes do imóvel ${dados.property.title}`, path: null }
        ]} />

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="page-header font-bold text-dark text-3xl mb-0 flex items-center gap-2">
                <FaBuilding className="text-cyan-500" /> {dados.property.title || 'Título não disponível'}
              </h1>
            </div>
            <div className="d-flex gap-2">
              {dados.property.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-warning"
                    onClick={handleEditClick}
                  >
                    <i className="fa fa-edit me-2"></i>
                    Editar Propriedade
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="fa fa-trash me-2"></i>
                    Excluir Propriedade
                  </button>
                </>
              )}
            </div>
          </div>
         
          <div className="d-flex flex-wrap gap-2 mb-4">
            <span className="badge bg-secondary-subtle text-secondary px-3 py-2">Novo</span>
            <span className="badge bg-primary-subtle text-primary px-3 py-2">Isento de IR</span>

            {dados.property?.contract_address && (
              <a
                href={`https://polygonscan.com/token/${dados.property.contract_address}`}
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

           <div className="row mb-4">
            <div className="col-12 mb-3">
              <h4 className="text-dark">Estatísticas da Propriedade</h4>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="widget widget-stats bg-blue">
                <div className="stats-icon stats-icon-lg"><FaCubes /></div>
                <div className="stats-content">
                  <div className="stats-title">TOKENS ORIGINAIS</div>
                  <div className="stats-number">{dados.property.total_tokens_original}</div>
                  <div className="stats-desc">Total de tokens criados</div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="widget widget-stats bg-info">
                <div className="stats-icon stats-icon-lg"><FaCoins /></div>
                <div className="stats-content">
                  <div className="stats-title">TOKENS VENDIDOS</div>
                  {/* <div className="stats-number">{resumo.tokens_vendidos}</div> */}
                <div className="stats-desc">Total vendido</div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="widget widget-stats bg-purple">
              <div className="stats-icon stats-icon-lg"><FaCubes /></div>
              <div className="stats-content">
                <div className="stats-title">TOKENS DISPONÍVEIS</div>
                <div className="stats-number">{dados.property.total_tokens}</div>
                <div className="stats-desc">Disponível para venda</div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="widget widget-stats bg-dark">
              <div className="stats-icon stats-icon-lg"><FaUsers /></div>
              <div className="stats-content">
                <div className="stats-title">INVESTIDORES ÚNICOS</div>
                {/* <div className="stats-number">{resumo.investidores_unicos}</div> */}
                {/* <div className="stats-desc">Total de investidores</div> */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Abas de navegação */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${aba === 'financeiro' ? 'active' : ''}`} 
              onClick={() => setAba('financeiro')}
            >
              Investimentos
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${aba === 'investidores' ? 'active' : ''}`} 
              onClick={() => setAba('investidores')}
            >
              Investidores
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${aba === 'p2p' ? 'active' : ''}`} 
              onClick={() => setAba('p2p')}
            >
              Transações P2P
            </button>
          </li>
        </ul>
        
        {/* <div className="panel panel-inverse">
          <div className="panel-body">{aba === 'financeiro' && (
            <div>
              <h4 className="mb-3">Investimentos</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Investidor</th>
                      <th>Qtd. Tokens</th>
                      <th>Valor Unitário</th>
                      <th>Origem</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investimentos.length === 0 && (
                      <tr><td colSpan={6} className="text-muted">Nenhum investimento encontrado.</td></tr>
                    )}
                    {investimentos.map((inv, idx) => (
                      <tr key={idx}>
                        <td>{inv.data_compra}</td>
                        <td>{inv.nome_investidor}</td>
                        <td>{inv.qtd_tokens}</td>
                        <td>R$ {Number(inv.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>{inv.origem}</td>
                        <td><span className={`badge ${inv.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>{inv.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {aba === 'investidores' && (
            <div>
              <h4 className="mb-3">Investidores do Imóvel</h4>
              <div className="row g-4">
                {investidores.length === 0 && (
                  <div className="col-12 text-muted">Nenhum investidor encontrado.</div>
                )}
                {investidores.map((inv) => (
                  <div key={inv.id_investidor} className="col-lg-4 col-md-6">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <FaUser className="text-primary mb-2" size={40} />
                        <h6 className="card-title">{inv.nome}</h6>
                        <p className="text-muted small">ID: {inv.id_investidor}</p>
                        <span className="badge bg-primary mb-2">Tokens: {inv.qtd_tokens}</span>
                        <p className="text-muted small">{inv.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {aba === 'p2p' && (
            <div>
              <h4 className="mb-3">Transações P2P</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Investidor</th>
                      <th>Qtd. Tokens</th>
                      <th>Valor Unitário</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoes_p2p.length === 0 && (
                      <tr><td colSpan={5} className="text-muted">Nenhuma transação P2P encontrada.</td></tr>
                    )}
                    {transacoes_p2p.map((t, idx) => (
                      <tr key={idx}>
                        <td>{t.data}</td>
                        <td>{t.nome_investidor || t.id_investidor}</td>
                        <td>{t.qtd_tokens}</td>
                        <td>R$ {Number(t.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td><span className={`badge ${t.status === 'ativo' ? 'bg-success' : 'bg-secondary'}`}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        </div> */}
        </div>
        
        <div className="card border-0 shadow-sm p-4 mb-5">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                <FaImage className="text-primary" /> Galeria de Imagens
              </h5>
              <div className="panel panel-inverse h-100">
                <div className="panel-body p-3">
                  <div className="position-relative overflow-hidden rounded-3 shadow-sm" style={{ height: '450px' }}>
                    {dados.property.files && dados.property.files.length > 0 ? (
                      <Image
                        src={dados.property.files[0]?.url || '/assets/img/theme/default.jpg'}
                        alt={`Imagem da propriedade ${dados.property.title}`}
                        className="w-100 h-100 object-fit-cover"
                        width={800}
                        height={450}
                        onError={(e) => { 
                          e.target.src = '/assets/img/theme/default.jpg'; 
                        }}
                      />
                    ) : (
                      <>
                        <Image
                          src="/assets/img/theme/default.jpg"
                          alt="Imagem padrão da propriedade"
                          className="w-100 h-100 object-fit-cover opacity-75"
                          width={800}
                          height={450}
                        />
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <div className="bg-white bg-opacity-90 rounded-3 p-4 shadow">
                            <FaImage size={48} className="text-muted mb-2" />
                            <p className="text-muted mb-0 fw-medium">Imagem não disponível</p>
                            <small className="text-muted">Usando imagem padrão</small>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {dados.property.files && dados.property.files.length > 1 && (
                    <div className="mt-3">
                      <div className="d-flex gap-2 overflow-auto pb-2">
                        {dados.property.files.slice(1, 5).map((img, index) => (
                          <div key={index} className="flex-shrink-0">
                            <Image
                              src={img.url || '/assets/img/theme/default.jpg'}
                              alt={`Imagem adicional ${index + 2}`}
                              className="rounded-2 object-fit-cover border"
                              style={{ width: '80px', height: '60px' }}
                              width={80}
                              height={60}
                              onError={(e) => { 
                                e.target.src = '/assets/img/theme/default.jpg'; 
                              }}
                            />
                          </div>
                        ))}
                        {dados.property.files.length > 5 && (
                          <div className="flex-shrink-0 d-flex align-items-center justify-content-center bg-light rounded-2 border text-muted" 
                               style={{ width: '80px', height: '60px', fontSize: '12px' }}>
                            +{dados.property.files.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                <FaBuilding className="text-success" /> Detalhes da Propriedade
              </h5>
              <div className="panel panel-inverse h-100">
                <div className="panel-body">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaCheckCircle className={dados.property.status === 'ativo' ? 'text-success' : 'text-muted'} />
                      <span className="text-muted">Status:</span>
                      <span className={dados.property.status === 'ativo' ? 'text-success fw-semibold' : 'text-muted fw-semibold'}>
                        {dados.property.status === 'pending' ? 'PENDENTE' : dados.property.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaCoins className="text-warning" />
                      <span className="text-muted">Valor Total:</span>
                      <span className="fw-semibold">
                        R$ {Number(dados.property.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaMapMarkerAlt className="text-info" />
                      <span className="text-muted">Localização:</span>
                      <span className="fw-semibold">{dados.property.location || 'Não informado'}</span>
                    </div>

                    {/* Nível de Garantia */}
                    <div className="p-3 bg-light rounded-3 mt-3">
                      <h6 className="text-muted mb-2 fw-medium">Nível de Garantia</h6>
                      <p className="text-muted mb-2 small">Esse investimento está classificado no <strong>Nível 5</strong></p>
                      <div className="d-flex gap-2 align-items-end">
                        {[1, 2, 3, 4, 5].map((nivel, idx) => {
                          const coresGarantia = ['#e53935', '#f6c244', '#f6e244', '#4fc3f7', '#43a047'];
                          const nivelAtual = 5;
                          return (
                            <div key={nivel} className="text-center flex-fill">
                              <div style={{ fontSize: 10, color: coresGarantia[idx], opacity: nivel === nivelAtual ? 1 : 0.3, fontWeight: 'bold' }}>
                                Nível {nivel}
                              </div>
                              <div
                                className="rounded-pill mt-1"
                                style={{ height: 6, backgroundColor: coresGarantia[idx], opacity: nivel === nivelAtual ? 1 : 0.3 }}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {dados.property.description && (
                      <div className="p-3 bg-light rounded-3">
                        <h6 className="text-muted mb-2 fw-medium d-flex align-items-center gap-2">
                          <i className="fa fa-align-left"></i> Descrição
                        </h6>
                        <p className="small text-muted mb-0 lh-base">{dados.property.description}</p>
                      </div>
                    )}

                    {/* Informações Detalhadas do Investimento */}
                    <div className="row row-cols-1 g-2 text-muted small mt-3">
                      <div><strong>Devedor:</strong><br />Gran Vellas Wins Empreendimentos SPE Ltda.</div>
                      <div><strong>Periodicidade da Remuneração:</strong><br />Cash Sweep</div>
                      <div><strong>Fluxo de Amortização:</strong><br />Cash Sweep</div>
                      <div><strong>Garantia:</strong><br />Imóveis, Recebíveis, Cotas e Aval</div>
                      <div><strong>Lastro:</strong><br />Recebíveis Imobiliários</div>
                      <div><strong>Cronograma:</strong><br />Conforme descrito no Termo de Securitização</div>
                      <div><strong>Valor Mínimo:</strong><br />R$ 1.000</div>
                    </div>

                    {dados.property?.contract_address && (
                      <div className="text-center">
                        <a
                          href={`https://polygonscan.com/token/${dados.property.contract_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2"
                          title="Ver contrato no PolygonScan"
                        >
                          <i className="fa fa-link"></i> 
                          Ver Contrato na Blockchain
                        </a>
                      </div>
                    )}

                    {dados.property.tokenization_date && (
                      <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa fa-calendar text-primary"></i>
                          <span className="text-muted fw-medium">Data de Tokenização</span>
                        </div>
                        <span className="fw-semibold text-dark">
                          {new Date(dados.property.tokenization_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="my-4" />
          
          {/* Seção de Documentos/Anexos */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2">
                <i className="fa fa-file-text text-primary"></i> Documentos e Anexos
              </h5>
              <div className="panel panel-inverse">
                <div className="panel-body">
                  {dados.property.attachments && dados.property.attachments.length > 0 ? (
                    <div className="row g-3">
                      {dados.property.attachments.map((attachment) => (
                        <div key={attachment.id} className="col-md-6 col-lg-4">
                          <div className="card border h-100">
                            <div className="card-body d-flex align-items-center">
                              <div className="me-3">
                                <i className="fa fa-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="card-title mb-1 text-truncate" title={attachment.name}>
                                  {attachment.name}
                                </h6>
                                <small className="text-muted">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </small>
                                <br />
                                <small className="text-muted">
                                  {new Date(attachment.created_at).toLocaleDateString('pt-BR')}
                                </small>
                              </div>
                              <div>
                                <a
                                  href={attachment.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                  title="Baixar documento"
                                >
                                  <i className="fa fa-download"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fa fa-file-text text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                      <p className="text-muted mb-0">Nenhum documento anexado a esta propriedade.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          
          {/* Progresso do Investimento */}
          {
      /* <div className="row">
            <div className="col-12">
              <div className="panel panel-inverse">
                <div className="panel-body">
                  <h5 className="mb-3 fw-bold text-dark">Progresso do Investimento</h5>
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>R$ {(resumo.tokens_vendidos * (imovel.valor_total / imovel.qtd_tokens_original)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Total</span>
                  </div>
                  <div className="progress mb-3" style={{ height: 12 }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${(resumo.tokens_vendidos / imovel.qtd_tokens_original) * 100}%` }}
                    ></div>
                  </div>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="fw-semibold text-primary">{((resumo.tokens_vendidos / imovel.qtd_tokens_original) * 100).toFixed(1)}%</div>
                      <small className="text-muted">Vendido</small>
                    </div>
                    <div className="col-md-3">
                      <div className="fw-semibold text-success">R$ {(resumo.tokens_vendidos * (imovel.valor_total / imovel.qtd_tokens_original)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <small className="text-muted">Arrecadado</small>
                    </div>
                    <div className="col-md-3">
                      <div className="fw-semibold text-info">R$ {(imovel.qtd_tokens * (imovel.valor_total / imovel.qtd_tokens_original)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <small className="text-muted">Disponível</small>
                    </div>
                    <div className="col-md-3">
                      <div className="fw-semibold text-dark">{resumo.investidores_unicos}</div>
                      <small className="text-muted">Investidores</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        
      

      </main>

      <CustomModal
        id="editPropertyModal"
        title="Editar Propriedade"
        show={showEditModal}
        onConfirm={handleSaveChanges}
        onCancel={() => setShowEditModal(false)}
        confirmText="Salvar Alterações"
        cancelText="Cancelar"
        confirmVariant="success"
        size="lg"
      >
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="title" className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={editFormData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pendente</option>
                <option value="active">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descrição</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={editFormData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="location" className="form-label">Localização</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="total_value" className="form-label">Valor Total</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="total_value"
                name="total_value"
                value={editFormData.total_value}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="total_tokens" className="form-label">Total de Tokens</label>
              <input
                type="number"
                className="form-control"
                id="total_tokens"
                name="total_tokens"
                value={editFormData.total_tokens}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </form>
      </CustomModal>

      {/* Modal para excluir propriedade naquele modelo*/}
      <CustomModal
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        title={`Excluir Propriedade: ${dados?.property?.title || 'Propriedade'}`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
        size="md"
      >
        <p>Tem certeza que deseja excluir a propriedade <strong>"{dados?.property?.title}"</strong>?</p>
        <p className="text-muted">Esta ação não pode ser desfeita.</p>
      </CustomModal>
    </div>
    </ProtectedRoute>
  );
}