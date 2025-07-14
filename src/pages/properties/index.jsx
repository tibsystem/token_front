/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getProperties } from '@/services/properties/getProperties';
import { PropertyCardSkeleton } from '@/components/Skeleton/Skeleton';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import '@/styles/marketplace.css';

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [sortBy, setSortBy] = useState('valor_desc'); 
  const [viewMode, setViewMode] = useState('grid'); 
  const [filterValue, setFilterValue] = useState('todos');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const formatDateToBR = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        setImoveis(Array.isArray(response) ? response : []);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar imóveis.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const imoveisFiltrados = useMemo(() => {
    let filtered = imoveis.filter(imovel => {
      const matchesSearch = !debouncedSearchTerm || 
        imovel?.titulo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        imovel?.localizacao?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'todos' || imovel?.status === filterStatus;
      
      let matchesValue = true;
      const valor = imovel?.valor_total || 0;
      switch (filterValue) {
        case 'ate_100k':
          matchesValue = valor <= 100000;
          break;
        case '100k_500k':
          matchesValue = valor > 100000 && valor <= 500000;
          break;
        case 'acima_500k':
          matchesValue = valor > 500000;
          break;
        default:
          matchesValue = true;
      }
      
      return matchesSearch && matchesStatus && matchesValue;
    });

    // Ordenação
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'valor_desc':
          return (b.valor_total || 0) - (a.valor_total || 0);
        case 'valor_asc':
          return (a.valor_total || 0) - (b.valor_total || 0);
        case 'tokens_desc':
          return (b.qtd_tokens || 0) - (a.qtd_tokens || 0);
        case 'titulo_asc':
          return (a.titulo || '').localeCompare(b.titulo || '');
        default:
          return 0;
      }
    });
  }, [imoveis, debouncedSearchTerm, filterStatus, filterValue, sortBy]);

  // Função para limpar todos os filtros
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterValue('todos');
    setSortBy('valor_desc');
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'bg-success-subtle text-success';
      case 'inativo':
        return 'bg-danger-subtle text-danger';
      case 'pendente':
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  const getRentabilidadeColor = (status) => {
    return status === 'ativo' ? 'text-success' : 'text-muted';
  };

  // Estatísticas otimizadas
  const stats = useMemo(() => ({
    total: imoveis.length,
    ativo: imoveis.filter(i => i.status === 'ativo').length,
    tokens: imoveis.reduce((sum, i) => sum + (i.qtd_tokens || 0), 0),
    totalValue: imoveis.reduce((sum, i) => sum + (i.valor_total || 0), 0)
  }), [imoveis]);

  // Verifica se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || filterStatus !== 'todos' || filterValue !== 'todos' || sortBy !== 'valor_desc';
  }, [searchTerm, filterStatus, filterValue, sortBy]);

  // Estado de busca em andamento
  const isSearching = searchTerm !== debouncedSearchTerm;

  return (
    <ProtectedRoute>
    <div className="px-4 py-5">
      <BreadCrumb 
        items={[
          { label: 'Imóveis', href: '/properties' }
        ]} />
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-dark d-flex align-items-center">
            <i className="fa fa-building me-3 text-primary"></i>
            Oportunidades de Investimento
          </h1>
          <p className="text-muted fs-5 mb-0">Diversifique seu portfólio com investimentos imobiliários tokenizados</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-light text-dark fs-6 p-2">
            <i className="fa fa-home me-2"></i>
            {stats.total} propriedades
          </div>
          {/* <div className="badge bg-success-subtle text-success fs-6 p-2">
            <i className="fa fa-chart-line me-2"></i>
            IPCA + 14% a.a.
          </div> */}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
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
            <i className="fa fa-building empty-state-icon"></i>
          </div>
          <h3 className="text-muted mb-3">Nenhuma propriedade disponível</h3>
          <p className="text-muted mb-4">Em breve novas oportunidades de investimento estarão disponíveis.</p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => window.location.reload()}
          >
            <i className="fa fa-refresh me-2"></i>
            Atualizar Página
          </button>
        </div>
      )}

      {/* Search and Filter Section */}
      {!loading && imoveis.length > 0 && (
        <>
          {/* Quick Stats */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="card border-0 bg-primary-subtle">
                <div className="card-body text-center py-3">
                  <i className="fa fa-building text-primary fs-2 mb-2"></i>
                  <div className="fw-bold fs-4 text-primary">{stats.total}</div>
                  <small className="text-muted">Propriedades</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-success-subtle">
                <div className="card-body text-center py-3">
                  <i className="fa fa-check-circle text-success fs-2 mb-2"></i>
                  <div className="fw-bold fs-4 text-success">
                    {stats.ativo}
                  </div>
                  <small className="text-muted">Disponíveis</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-warning-subtle">
                <div className="card-body text-center py-3">
                  <i className="fa fa-coins text-warning fs-2 mb-2"></i>
                  <div className="fw-bold fs-4 text-warning">
                    {stats.tokens.toLocaleString()}
                  </div>
                  <small className="text-muted">Tokens Totais</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-info-subtle">
                <div className="card-body text-center py-3">
                  <i className="fa fa-chart-line text-info fs-2 mb-2"></i>
                  <div className="fw-bold fs-4 text-info">14%</div>
                  <small className="text-muted">Rentabilidade</small>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4 g-3">
            <div className="col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                    <i className="fa fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por título ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  title="Digite para buscar propriedades por nome ou localização"
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
            
            <div className="col-lg-2">
              <select 
                className={`form-select ${filterStatus !== 'todos' ? 'border-success bg-success-subtle' : ''}`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                title="Filtrar por status"
              >
                <option value="todos">Todos Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            
            <div className="col-lg-2">
              <select 
                className={`form-select ${filterValue !== 'todos' ? 'border-warning bg-warning-subtle' : ''}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                title="Filtrar por faixa de valor"
              >
                <option value="todos">Todas Faixas</option>
                <option value="ate_100k">Até R$ 100k</option>
                <option value="100k_500k">R$ 100k - 500k</option>
                <option value="acima_500k">Acima R$ 500k</option>
              </select>
            </div>
            
            <div className="col-lg-2">
              <select 
                className={`form-select ${sortBy !== 'valor_desc' ? 'border-info bg-info-subtle' : ''}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Ordenar propriedades"
              >
                <option value="valor_desc">Maior Valor</option>
                <option value="valor_asc">Menor Valor</option>
                <option value="tokens_desc">Mais Tokens</option>
                <option value="titulo_asc">Nome (A-Z)</option>
              </select>
            </div>
            
            <div className="col-lg-2">
              <div className="btn-group w-100" role="group">
                <button 
                  type="button" 
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Visualização em grade"
                >
                  <i className="fa fa-th"></i>
                </button>
                <button 
                  type="button" 
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                  title="Visualização em lista"
                >
                  <i className="fa fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted d-flex align-items-center">
                {isSearching ? (
                  <>
                    <div className="" role="status"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    Mostrando {imoveisFiltrados.length} de {stats.total} propriedades
                    {hasActiveFilters && (
                      <i className="fa fa-filter ms-2 text-primary" title="Filtros ativos"></i>
                    )}
                  </>
                )}
              </small>
              
              {/* Active Filters */}
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
                {filterStatus !== 'todos' && (
                  <span className="badge bg-success-subtle text-success">
                    <i className="fa fa-filter me-1"></i>
                    Status: {filterStatus}
                    <button 
                      className="btn btn-link p-0 ms-1" 
                      style={{ fontSize: '0.7rem', color: 'inherit' }}
                      onClick={() => setFilterStatus('todos')}
                      title="Remover filtro de status"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                )}
                {filterValue !== 'todos' && (
                  <span className="badge bg-warning-subtle text-warning">
                    <i className="fa fa-coins me-1"></i>
                    {filterValue === 'ate_100k' && 'Até R$ 100k'}
                    {filterValue === '100k_500k' && 'R$ 100k - 500k'}
                    {filterValue === 'acima_500k' && 'Acima R$ 500k'}
                    <button 
                      className="btn btn-link p-0 ms-1" 
                      style={{ fontSize: '0.7rem', color: 'inherit' }}
                      onClick={() => setFilterValue('todos')}
                      title="Remover filtro de valor"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                )}
                {sortBy !== 'valor_desc' && (
                  <span className="badge bg-info-subtle text-info">
                    <i className="fa fa-sort me-1"></i>
                    {sortBy === 'valor_asc' && 'Menor Valor'}
                    {sortBy === 'tokens_desc' && 'Mais Tokens'}
                    {sortBy === 'titulo_asc' && 'Nome A-Z'}
                    <button 
                      className="btn btn-link p-0 ms-1" 
                      style={{ fontSize: '0.7rem', color: 'inherit' }}
                      onClick={() => setSortBy('valor_desc')}
                      title="Resetar ordenação"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                )}
              </div>
            </div>
            
            {hasActiveFilters && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={clearAllFilters}
                title="Limpar todos os filtros"
              >
                <i className="fa fa-times me-1"></i>
                Limpar Tudo
              </button>
            )}
          </div>
        </>
      )}

      <div className={viewMode === 'grid' ? 'row g-4' : 'row g-3'}>
        {loading && (
          <>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </>
        )}

        {!loading && stats.total > 0 && imoveisFiltrados.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fa fa-search-minus text-muted empty-state-icon"></i>
              </div>
              <h3 className="text-muted mb-3">
                {hasActiveFilters ? 'Nenhum resultado encontrado' : 'Nenhuma propriedade disponível'}
              </h3>
              <p className="text-muted mb-4">
                {hasActiveFilters 
                  ? debouncedSearchTerm
                    ? `Não encontramos propriedades com "${debouncedSearchTerm}". Tente outros termos de busca.`
                    : 'Tente ajustar os filtros para encontrar propriedades.'
                  : 'Não há propriedades que correspondam aos critérios atuais.'
                }
              </p>
              {hasActiveFilters && (
                <button 
                  className="btn btn-primary"
                  onClick={clearAllFilters}
                >
                  <i className="fa fa-refresh me-2"></i>
                  Limpar Todos os Filtros
                </button>
              )}
              
              {/* Sugestões quando não há resultados */}
              {hasActiveFilters && debouncedSearchTerm && (
                <div className="mt-4">
                  <small className="text-muted">
                    💡 Dica: Tente termos mais gerais como "apartamento", "casa" ou verifique a ortografia
                  </small>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && imoveisFiltrados.map((imovel) => (
          viewMode === 'grid' ? (
            // Grid View
            <div key={imovel.id} className="col-xl-4 col-lg-6">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-card">
                <div className="position-relative">
                  <img
                    src="/assets/img/theme/default.jpg"
                    alt="Imagem do imóvel"
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`badge ${getStatusBadgeClass(imovel.status)} px-2 py-1`}>
                      <i className="fa fa-circle me-1" style={{ fontSize: '0.5rem' }}></i>
                      {imovel.status}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-top p-3">
                    <h5 className="fw-bold text-white text-shadow mb-0">{imovel.titulo}</h5>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <p className="text-muted fs-6 mb-3">Direito de recebimento de antecipações do segmento imobiliário</p>

                  {/* Nível de Garantia */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted fw-semibold">Nível de Garantia</small>
                      <small className="text-success fw-bold">Nível 3</small>
                    </div>
                    <div className="progress bg-light" style={{ height: '6px' }}>
                      <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  {/* Informações Financeiras */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded p-2 text-center">
                        <div className={`fw-bold ${getRentabilidadeColor(imovel.status)}`}>
                          IPCA + 14%
                        </div>
                        <small className="text-muted">a.a.</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-2 text-center">
                        <div className="text-primary fw-bold">
                          R$ 1.000
                        </div>
                        <small className="text-muted">Mín.</small>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes da Propriedade */}
                  <div className="d-flex flex-column gap-2 mb-3 text-muted fs-6">
                    <div className="d-flex align-items-center">
                      <i className="fa fa-map-marker-alt me-2 text-primary" style={{ width: '16px' }}></i>
                      <span className="text-truncate">{imovel.localizacao}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="fa fa-coins me-2 text-warning" style={{ width: '16px' }}></i>
                        <span>R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-cubes me-2 text-secondary" style={{ width: '16px' }}></i>
                        <span>{imovel.qtd_tokens} tokens</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-calendar-alt me-2 text-info" style={{ width: '16px' }}></i>
                      <span>Tokenizado em {formatDateToBR(imovel.data_tokenizacao)}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/properties/${imovel.id}`} 
                    className={`btn ${imovel.status === 'ativo' ? 'btn-primary' : 'btn-outline-secondary'} mt-auto w-100 d-flex align-items-center justify-content-center`}
                  >
                    <i className="fa fa-calculator me-2"></i>
                    {imovel.status === 'ativo' ? 'Simular Investimento' : 'Ver Detalhes'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // List View
            <div key={imovel.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-3 hover-card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src="/assets/img/theme/default.jpg"
                        alt="Imagem do imóvel"
                        className="img-fluid rounded"
                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h5 className="fw-bold text-dark mb-1">{imovel.titulo}</h5>
                      <div className="d-flex align-items-center text-muted mb-1">
                        <i className="fa fa-map-marker-alt me-2 text-primary"></i>
                        <span>{imovel.localizacao}</span>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(imovel.status)}`}>
                        {imovel.status}
                      </span>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="text-success fw-bold">IPCA + 14%</div>
                      <small className="text-muted">a.a.</small>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="fw-bold">R$ {Number(imovel.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <small className="text-muted">{imovel.qtd_tokens} tokens</small>
                    </div>
                    <div className="col-md-2">
                      <Link 
                        href={`/properties/${imovel.id}`} 
                        className={`btn ${imovel.status === 'ativo' ? 'btn-primary' : 'btn-outline-secondary'} w-100`}
                      >
                        {imovel.status === 'ativo' ? 'Investir' : 'Ver'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
}