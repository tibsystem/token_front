/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getInvestments } from '@/services/investments/getInvestments';
import { getOnePropertie } from '@/services/properties/getOnePropertie';
import { postP2pListings } from '@/services/p2p/postP2pListings';
import { toast } from 'react-toastify';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import '@/styles/marketplace.css';

export default function NovaOfertaPage() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImovel, setModalImovel] = useState(null);
  const [qtdVenda, setQtdVenda] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tokens'); // 'tokens', 'price', 'name'
  const [validationErrors, setValidationErrors] = useState({});

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


 const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    const numberValue = parseInt(numericValue) / 100;
    
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

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
        const response = await getInvestments(userId);
        const investimentos = Array.isArray(response) ? response : (response ? [response] : []);
        
        const imoveisDetalhados = await Promise.all(
          investimentos.map(async (inv) => {
            const propertyResponse = await getOnePropertie(inv?.id_imovel);
            return {
              ...propertyResponse,
              qtd_tokens: inv?.qtd_tokens || 0,
              valor_unitario: inv?.valor_unitario || 0,
              investimento_id: inv?.id
            };
          })
        );
        
        const imoveisValidos = imoveisDetalhados.filter(imovel => imovel && imovel.id);
        setImoveis(imoveisValidos);
      } catch {
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
    const valorInicial = (imovel?.valor_unitario || 0) * 100; 
    setPrecoVenda(formatCurrency(valorInicial.toString()));
  };

  const fecharModal = () => {
    setModalImovel(null);
    setQtdVenda('');
    setPrecoVenda('');
    setValidationErrors({});
  };

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const imoveisFiltrados = useMemo(() => {
    return imoveis
      .filter(imovel => 
        imovel?.titulo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        imovel?.descricao?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'tokens':
            return (b.qtd_tokens || 0) - (a.qtd_tokens || 0);
          case 'price':
            return (b.valor_unitario || 0) - (a.valor_unitario || 0);
          case 'name':
            return (a.titulo || '').localeCompare(b.titulo || '');
          default:
            return 0;
        }
      });
  }, [imoveis, debouncedSearchTerm, sortBy]);

  const calcularValorTotal = useCallback(() => {
    if (!qtdVenda || !precoVenda) return 'R$ 0,00';
    const preco = parseFloat(precoVenda.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return (Number(qtdVenda) * preco).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }, [qtdVenda, precoVenda]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!qtdVenda || Number(qtdVenda) < 1) {
      errors.qtdVenda = 'Quantidade deve ser maior que 0';
    } else if (Number(qtdVenda) > (modalImovel?.qtd_tokens || 0)) {
      errors.qtdVenda = `Máximo ${modalImovel?.qtd_tokens || 0} tokens`;
    }
    
    if (!precoVenda) {
      errors.precoVenda = 'Preço é obrigatório';
    } else {
      const preco = parseFloat(precoVenda.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      if (preco <= 0) {
        errors.precoVenda = 'Preço deve ser maior que R$ 0,00';
      } else if (preco < 0.01) {
        errors.precoVenda = 'Preço mínimo de R$ 0,01';
      }
    }
    
    return errors;
  }, [qtdVenda, precoVenda, modalImovel?.qtd_tokens]);

  useEffect(() => {
    if (modalImovel && (qtdVenda || precoVenda)) {
      const errors = validateForm();
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [qtdVenda, precoVenda, modalImovel, validateForm]);

  const recarregarDados = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      try {
        const response = await getInvestments(userId);
        const investimentos = Array.isArray(response) ? response : (response ? [response] : []);
        
        const imoveisDetalhados = await Promise.all(
          investimentos.map(async (inv) => {
            const propertyResponse = await getOnePropertie(inv?.id_imovel);
            return {
              ...propertyResponse,
              qtd_tokens: inv?.qtd_tokens || 0,
              valor_unitario: inv?.valor_unitario || 0,
              investimento_id: inv?.id
            };
          })
        );
        
        const imoveisValidos = imoveisDetalhados.filter(imovel => imovel && imovel.id);
        setImoveis(imoveisValidos);
      } catch (error) {
        console.error('Erro ao recarregar dados:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Por favor, corrija os erros do formulário');
      return;
    }
    
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
      
      const precoNumerico = precoVenda.replace(/[^\d,]/g, '').replace(',', '.');
      
      const payload = {
        vendedor_id,
        id_imovel: modalImovel?.id,
        qtd_tokens: Number(qtdVenda) || 0,
        valor_unitario: Number(precoNumerico) || 0
      };
      
      await postP2pListings(payload);
      fecharModal();
      toast.success(' Oferta criada com sucesso! Sua oferta já está disponível no marketplace.');
      
      await recarregarDados();
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      toast.error(' Erro ao criar oferta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalTokensDisponiveis = useMemo(() => {
    return imoveis.reduce((total, imovel) => total + (imovel.qtd_tokens || 0), 0);
  }, [imoveis]);

  return (
    <ProtectedRoute>
    
    <div className="py-4">
      <BreadCrumb items={[
        { label: 'P2P', path: '#' },
        { label: 'Nova Oferta', path: '/p2p/new_offer' }
      ]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-2xl mb-2 text-dark d-flex align-items-center">
            <i className="fa fa-store me-3 text-primary"></i>
            Marketplace de Tokens
          </h1>
          <p className="text-muted mb-0">Venda seus tokens de propriedades no marketplace P2P</p>
        </div>
        <div className="badge bg-light text-dark fs-6 p-2">
          <i className="fa fa-cubes me-2"></i>
          {totalTokensDisponiveis} tokens disponíveis
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <div className="text-muted">Carregando seus investimentos...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="fa fa-exclamation-triangle me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && imoveis.length === 0 && !error && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fa fa-home" style={{ fontSize: '4rem', color: '#e9ecef' }}></i>
          </div>
          <h3 className="text-muted mb-3">Nenhum token disponível</h3>
          <p className="text-muted mb-4">Você ainda não possui tokens para vender no marketplace.</p>
          <a href="/investments" className="btn btn-primary">
            <i className="fa fa-plus me-2"></i>Fazer Investimento
          </a>
        </div>
      )}

      {!loading && imoveis.length > 0 && (
        <>
          <div className="row mb-4 g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  {searchTerm !== debouncedSearchTerm ? (
                    <div className=" text-primary" role="status">
                      <span className="visually-hidden">Buscando...</span>
                    </div>
                  ) : (
                    <i className="fa fa-search text-muted"></i>
                  )}
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por nome ou descrição do imóvel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  title="Digite para buscar propriedades"
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    title="Limpar busca"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className={`form-select ${sortBy !== 'tokens' ? 'border-info bg-info-subtle' : ''}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Ordenar propriedades"
              >
                <option value="tokens">Ordenar por Tokens (maior)</option>
                <option value="price">Ordenar por Preço (maior)</option>
                <option value="name">Ordenar por Nome (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted d-flex align-items-center">
                {searchTerm !== debouncedSearchTerm ? (
                  <>
                    <div className=" me-2" role="status"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    Mostrando {imoveisFiltrados.length} de {imoveis.length} propriedades
                    {(searchTerm || sortBy !== 'tokens') && (
                      <i className="fa fa-filter ms-2 text-primary" title="Filtros ativos"></i>
                    )}
                  </>
                )}
              </small>
              
              <div className="d-flex gap-2 flex-wrap">
                {debouncedSearchTerm && (
                  <span className="badge bg-primary-subtle text-primary">
                    <i className="fa fa-search me-1"></i>
                    "{debouncedSearchTerm}"
                    <button 
                      className="btn btn-link p-0 ms-1" 
                      style={{ fontSize: '0.7rem', color: 'inherit' }}
                      onClick={() => setSearchTerm('')}
                      title="Remover busca"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                )}
                {sortBy !== 'tokens' && (
                  <span className="badge bg-info-subtle text-info">
                    <i className="fa fa-sort me-1"></i>
                    {sortBy === 'price' && 'Maior Preço'}
                    {sortBy === 'name' && 'Nome A-Z'}
                    <button 
                      className="btn btn-link p-0 ms-1" 
                      style={{ fontSize: '0.7rem', color: 'inherit' }}
                      onClick={() => setSortBy('tokens')}
                      title="Resetar ordenação"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
            
            {(searchTerm || sortBy !== 'tokens') && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('tokens');
                }}
                title="Limpar todos os filtros"
              >
                <i className="fa fa-times me-1"></i>
                Limpar Tudo
              </button>
            )}
          </div>
        </>
      )}

      {/* Properties Grid */}
      <div className="row g-4">
        {/* Empty search results */}
        {!loading && imoveis.length > 0 && imoveisFiltrados.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fa fa-search-minus text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h3 className="text-muted mb-3">Nenhum resultado encontrado</h3>
              <p className="text-muted mb-4">
                {debouncedSearchTerm 
                  ? `Não encontramos propriedades com "${debouncedSearchTerm}". Tente outros termos de busca.`
                  : 'Nenhuma propriedade corresponde aos filtros aplicados.'
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('tokens');
                }}
              >
                <i className="fa fa-refresh me-2"></i>
                Limpar Filtros
              </button>
              
              {/* Sugestões quando não há resultados */}
              {debouncedSearchTerm && (
                <div className="mt-4">
                  <small className="text-muted">
                    💡 Dica: Tente termos mais gerais ou verifique a ortografia
                  </small>
                </div>
              )}
            </div>
          </div>
        )}

        {imoveisFiltrados.map((imovel) => (
          <div className="col-md-6 col-lg-4" key={imovel.id}>
            <div className="card border-0 shadow-sm h-100 position-relative hover-card p2p-card">
              {/* Badge de tokens disponíveis */}
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-success">
                  <i className="fa fa-cubes me-1"></i>
                  {imovel?.qtd_tokens || 0} tokens
                </span>
              </div>
              
              <div className="position-relative">
                <img
                  src={imovel.imagem_url || '/assets/img/default-property.jpg'}
                  alt={imovel.titulo}
                  className="card-img-top"
                  style={{ 
                    height: 200, 
                    objectFit: 'cover', 
                    borderTopLeftRadius: '0.5rem', 
                    borderTopRightRadius: '0.5rem' 
                  }}
                  onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
                />
                <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-top p-3">
                  <h2 className="card-title h5 mb-0 text-white text-shadow">
                    <i className="fa fa-home me-2"></i>
                    {imovel?.titulo || 'Imóvel'}
                  </h2>
                </div>
              </div>
              
              <div className="card-body">
                <p className="text-muted mb-3 small" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {imovel?.descricao || 'Sem descrição disponível'}
                </p>
                
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="bg-light rounded p-2 text-center">
                      <div className="text-success fw-bold">
                        <i className="fa fa-coins me-1"></i>
                        R$ {Number(imovel?.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <small className="text-muted">Por token</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-light rounded p-2 text-center">
                      <div className="text-primary fw-bold">
                        <i className="fa fa-calculator me-1"></i>
                        {((imovel?.qtd_tokens || 0) * (imovel?.valor_unitario || 0)).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                      <small className="text-muted">Valor total</small>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={() => abrirModal(imovel)}
                  disabled={!imovel?.qtd_tokens || imovel?.qtd_tokens === 0}
                >
                  <i className="fa fa-store me-2"></i>
                  {!imovel?.qtd_tokens || imovel?.qtd_tokens === 0 ? 'Sem tokens' : 'Criar Oferta'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de venda melhorado */}
      {modalImovel && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <i className="fa fa-store me-2"></i>
                  Criar Oferta de Venda
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={fecharModal}></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Informações do imóvel */}
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <img
                        src={modalImovel?.imagem_url || '/assets/img/default-property.jpg'}
                        alt={modalImovel?.titulo}
                        className="img-fluid rounded"
                        style={{ height: 120, width: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = '/assets/img/default-property.jpg'; }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h6 className="fw-bold text-primary mb-2">
                        <i className="fa fa-home me-2"></i>
                        {modalImovel?.titulo || 'Imóvel'}
                      </h6>
                      <p className="text-muted small mb-2">{modalImovel?.descricao || 'Sem descrição'}</p>
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="bg-light rounded p-2 text-center">
                            <div className="fw-bold text-success">
                              {modalImovel?.qtd_tokens || 0}
                            </div>
                            <small className="text-muted">Tokens disponíveis</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-2 text-center">
                            <div className="fw-bold text-primary">
                              R$ {Number(modalImovel?.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <small className="text-muted">Valor unitário</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Progress indicator */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-semibold">Progresso do Formulário</small>
                      <small className="text-muted">
                        {qtdVenda && precoVenda && Object.keys(validationErrors).length === 0 ? '100%' : 
                         qtdVenda || precoVenda ? '50%' : '0%'}
                      </small>
                    </div>
                    <div className="progress bg-light" style={{ height: '4px' }}>
                      <div 
                        className={`progress-bar ${
                          qtdVenda && precoVenda && Object.keys(validationErrors).length === 0 
                            ? 'bg-success' 
                            : qtdVenda || precoVenda 
                              ? 'bg-warning' 
                              : 'bg-light'
                        }`} 
                        style={{ 
                          width: qtdVenda && precoVenda && Object.keys(validationErrors).length === 0 
                            ? '100%' 
                            : qtdVenda || precoVenda 
                              ? '50%' 
                              : '0%',
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Formulário de venda */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fa fa-cubes me-2 text-success"></i>
                          Quantidade de tokens
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={modalImovel?.qtd_tokens || 0}
                          value={qtdVenda}
                          onChange={e => setQtdVenda(e.target.value)}
                          className={`form-control form-control-lg ${validationErrors.qtdVenda ? 'is-invalid' : qtdVenda && !validationErrors.qtdVenda ? 'is-valid' : ''}`}
                          placeholder="Ex: 10"
                          required
                        />
                        {validationErrors.qtdVenda ? (
                          <div className="invalid-feedback">
                            <i className="fa fa-exclamation-circle me-1"></i>
                            {validationErrors.qtdVenda}
                          </div>
                        ) : (
                          <div className="form-text">
                            Máximo: {modalImovel?.qtd_tokens || 0} tokens disponíveis
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fa fa-coins me-2 text-warning"></i>
                          Preço por token
                        </label>
                        <input
                          type="text"
                          value={precoVenda}
                          onChange={e => setPrecoVenda(formatCurrency(e.target.value))}
                          className={`form-control form-control-lg ${validationErrors.precoVenda ? 'is-invalid' : precoVenda && !validationErrors.precoVenda ? 'is-valid' : ''}`}
                          placeholder="R$ 0,00"
                          required
                        />
                        {validationErrors.precoVenda ? (
                          <div className="invalid-feedback">
                            <i className="fa fa-exclamation-circle me-1"></i>
                            {validationErrors.precoVenda}
                          </div>
                        ) : (
                          <div className="form-text">
                            Valor sugerido: R$ {Number(modalImovel?.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resumo da venda */}
                  {qtdVenda && precoVenda && Object.keys(validationErrors).length === 0 && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="fa fa-calculator me-3 fs-4"></i>
                      <div>
                        <div className="fw-bold">Resumo da Oferta</div>
                        <div>
                          {qtdVenda} tokens × {precoVenda} = <span className="fw-bold text-primary">{calcularValorTotal()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Termos e condições */}
                  <div className="alert alert-warning">
                    <div className="d-flex">
                      <i className="fa fa-info-circle me-2 mt-1"></i>
                      <div>
                        <strong>Importante:</strong>
                        <ul className="mb-0 mt-1">
                          <li>Sua oferta será listada no marketplace P2P</li>
                          <li>Você pode cancelar a oferta a qualquer momento</li>
                          <li>Os tokens ficam bloqueados até a venda ou cancelamento</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                    <i className="fa fa-times me-2"></i>Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={submitting || Object.keys(validationErrors).length > 0 || !qtdVenda || !precoVenda}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Criando...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-check me-2"></i>Criar Oferta
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}