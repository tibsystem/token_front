/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getProperties } from '@/services/properties/getProperties';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useDarkMode from '@/hooks/useDarkMode';
import { CgSpinner } from "react-icons/cg";

export default function PropiedadesPage() {
  const [Propiedades, setPropiedades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [sortBy, setSortBy] = useState('valor_desc'); 
  const [viewMode, setViewMode] = useState('grid'); 
  const [filterValue, setFilterValue] = useState('todos');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { isDarkMode } = useDarkMode();

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
        setPropiedades(Array.isArray(response) ? response : []);
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

  const PropiedadesFiltrados = useMemo(() => {
    let filtered = Propiedades.filter(imovel => {
      const matchesSearch = !debouncedSearchTerm || 
        imovel?.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      // Corrigir filtro de status para aceitar pt/en e ignorar case
      const statusMap = {
        'ativo': ['ativo', 'active'],
        'inativo': ['inativo', 'inactive'],
        'pendente': ['pendente', 'pending']
      };
      let matchesStatus = true;
      if (filterStatus !== 'todos') {
        const imovelStatus = (imovel?.status || '').toLowerCase();
        matchesStatus = statusMap[filterStatus]?.includes(imovelStatus);
      }

      let matchesValue = true;
      const valor = imovel?.total_value || 0;
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

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'valor_desc':
          return (b.total_value || 0) - (a.total_value || 0);
        case 'valor_asc':
          return (a.total_value || 0) - (b.total_value || 0);
        case 'tokens_desc':
          return (b.total_tokens || 0) - (a.total_tokens || 0);
        case 'titulo_asc':
          return (a.titulo || '').localeCompare(b.titulo || '');
        default:
          return 0;
      }
    });
  }, [Propiedades, debouncedSearchTerm, filterStatus, filterValue, sortBy]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterValue('todos');
    setSortBy('valor_desc');
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativo':
        return 'bg-success-subtle text-success';
      case 'inactive':
      case 'inativo':
        return 'bg-danger-subtle text-danger';
      case 'pending':
      case 'pendente':
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'active': 'Ativo',
      'inactive': 'Inativo',
      'approved': 'Aprovado',
      'cancelled': 'Cancelado',
      'completed': 'Concluído',
      'rejected': 'Rejeitado',
    
    };
    return statusMap[status?.toLowerCase()] || status?.toUpperCase() || 'N/A';
  };

  const getRentabilidadeColor = (status) => {
    return (status?.toLowerCase() === 'ativo' || status?.toLowerCase() === 'active') ? 'text-success' : 'text-muted';
  };

  const stats = useMemo(() => ({
    total: Propiedades.length,
    ativo: Propiedades.filter(i => i.status?.toLowerCase() === 'active' || i.status?.toLowerCase() === 'ativo').length,
    tokens: Propiedades.reduce((sum, i) => sum + (i.total_tokens || 0), 0),
    totalValue: Propiedades.reduce((sum, i) => sum + (i.total_value || 0), 0)
  }), [Propiedades]);

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || filterStatus !== 'todos' || filterValue !== 'todos' || sortBy !== 'valor_desc';
  }, [searchTerm, filterStatus, filterValue, sortBy]);

  const isSearching = searchTerm !== debouncedSearchTerm;

  return (
    
    <div className="px-4 py-5">
      <BreadCrumb 
        items={[
          { label: 'Imóveis', href: '/properties' }
        ]} />
      
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-dark d-flex align-items-center">
            <i className="fa fa-building me-3 text-dark"></i>
            Oportunidades de Investimento
          </h1>
          <p className="text-muted fs-5 mb-0">Diversifique seu portfólio com investimentos imobiliários tokenizados</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-light text-dark fs-6 p-2">
            <i className="fa fa-home me-2"></i>
            {stats.total} propriedades
          </div>

        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="fa fa-exclamation-triangle me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {!loading && Propiedades.length === 0 && !error && (
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

      {!loading && Propiedades.length > 0 && (
        <>
          

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
                  title="Digite para buscar propriedades por nome"
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
                  className={`btn ${viewMode === 'grid' 
                    ? (isDarkMode ? 'btn-light' : 'btn-dark') 
                    : (isDarkMode ? 'btn-outline-light' : 'btn-outline-dark')}`}
                  onClick={() => setViewMode('grid')}
                  title="Visualização em grade"
                >
                  <i className="fa fa-th"></i>
                </button>
                <button 
                  type="button" 
                  className={`btn ${viewMode === 'list' 
                    ? (isDarkMode ? 'btn-light' : 'btn-dark') 
                    : (isDarkMode ? 'btn-outline-light' : 'btn-outline-dark')}`}
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
                    Mostrando {PropiedadesFiltrados.length} de {stats.total} propriedades
                    {hasActiveFilters && (
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
            <CgSpinner className='fa fa-spin' />
          </>
        )}

        {!loading && stats.total > 0 && PropiedadesFiltrados.length === 0 && (
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
                  className="btn btn-dark"
                  onClick={clearAllFilters}
                >
                  <i className="fa fa-refresh me-2"></i>
                  Limpar Todos os Filtros
                </button>
              )}
              
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

        {!loading && PropiedadesFiltrados.filter((imovel) => imovel.status?.toLowerCase() === 'ativo' || imovel.status?.toLowerCase() === 'active')
  .map((imovel) => (
          viewMode === 'grid' ? (
            <div key={imovel.id} className="col-xl-4 col-lg-6">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-card">
                <div className="position-relative">
                  <img
                    src={imovel.photos && imovel.photos.length > 0 ? imovel.photos[0].path : "/assets/img/theme/default.jpg"}
                    alt={`Imagem do imóvel ${imovel.title}`}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className={`badge ${getStatusBadgeClass(imovel.status)} px-2 py-1`}>
                      <i className="fa fa-circle me-1" style={{ fontSize: '0.5rem' }}></i>
                      {translateStatus(imovel.status)}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-top p-3">
                    <h5 className="fw-bold text-white text-shadow mb-0">{imovel.title}</h5>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <p className="text-muted fs-6 mb-3">Direito de recebimento de antecipações do segmento imobiliário</p>


                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted fw-semibold">Nível de Garantia</small>
                      <small className="text-success fw-bold">{imovel.level_warrant ? `Nível ${imovel.level_warrant}` : '-'}</small>
                    </div>
                    <div className="progress bg-light" style={{ height: '6px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${imovel.level_warrant ? Math.min(Number(imovel.level_warrant) * 20, 100) : 0}%`,
                          backgroundColor: (() => {
                            const coresGarantia = [
                              '#e53935', // 1
                              '#f6c244', // 2
                              '#f6e244', // 3
                              '#4fc3f7', // 4
                              '#43a047', // 5
                            ];
                            const nivel = Number(imovel.level_warrant);
                            return nivel >= 1 && nivel <= 5 ? coresGarantia[nivel - 1] : '#999';
                          })()
                        }}
                      ></div>
                    </div>
                    {imovel.warrant && (
                      <div className="mt-1  text-muted fw-bold" style={{ fontSize: 12 }}>
                        {imovel.warrant}
                      </div>
                    )}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded p-2 text-center">
                        <div className={`fw-bold ${getRentabilidadeColor(imovel.status)}`}
                          style={{ textTransform: 'uppercase' }}>
                          {imovel.profitability ? imovel.profitability : '-'}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      {/* <div className="bg-light rounded p-2 text-center">
                        <div className="text-primary fw-bold">
                          R$ 1.000
                        </div> */}
                        {/* <small className="text-muted">Mín.</small>
                      </div> */}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3 text-muted fs-6">
                    
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="fa fa-coins me-2 text-warning" style={{ width: '16px' }}></i>
                        <span>R$ {Number(imovel.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-cubes me-2 text-secondary" style={{ width: '16px' }}></i>
                        <span>{imovel.total_tokens} tokens</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-calendar-alt me-2 text-info" style={{ width: '16px' }}></i>
                      <span>Tokenizado em {formatDateToBR(imovel.data_tokenizacao)}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/properties/${imovel.id}`} 
                    className={`btn ${(imovel.status?.toLowerCase() === 'active' || imovel.status?.toLowerCase() === 'ativo') ? 'btn-dark' : 'btn-secondary'} mt-auto w-100 d-flex align-items-center justify-content-center`}
                  >
                    {(imovel.status?.toLowerCase() === 'active' || imovel.status?.toLowerCase() === 'ativo') ? 'Investir' : 'Ver Detalhes'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div key={imovel.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-3 hover-card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={imovel.photos && imovel.photos.length > 0 ? imovel.photos[0].path : "/assets/img/theme/default.jpg"}
                        alt={`Imagem do imóvel ${imovel.titulo}`}
                        className="img-fluid rounded"
                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/assets/img/theme/default.jpg'; }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h5 className="fw-bold text-dark mb-1">{imovel.title}</h5>
                     
                      <span className={`badge ${getStatusBadgeClass(imovel.status)}`}>
                        {translateStatus(imovel.status)}
                      </span>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className={`fw-bold ${getRentabilidadeColor(imovel.status)}`} style={{ textTransform: 'uppercase' }}>
                        {imovel.profitability ? imovel.profitability : '-'}
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="fw-bold">R$ {Number(imovel.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <small className="text-muted">{imovel.total_tokens} tokens</small>
                    </div>
                    <div className="col-md-2">
                      <Link 
                        href={`/properties/${imovel.id}`} 
                        className={`btn ${(imovel.status?.toLowerCase() === 'ativo' || imovel.status?.toLowerCase() === 'active') ? 'btn-dark' : 'btn-outline-secondary'} w-100`}
                      >
                        {(imovel.status?.toLowerCase() === 'ativo' || imovel.status?.toLowerCase() === 'active') ? 'Investir' : 'Ver'}
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
    
  );
}