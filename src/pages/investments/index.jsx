import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getInvestments } from '@/services/investments/getInvestments';
import BreadCrumb from '@/components/breadcrumb/breadcrumb';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-toastify';


const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function InvestimentosPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const totalInvestido = Array.isArray(transacoes) ? transacoes.reduce((acc, item) => {
    const valorUnitario = Number(item?.valor_unitario) || 0;
    const qtdTokens = Number(item?.qtd_tokens) || 0;
    return acc + (valorUnitario * qtdTokens);
  }, 0) : 0;
  
  const totalTokens = Array.isArray(transacoes) ? transacoes.reduce((acc, item) => {
    return acc + (Number(item?.qtd_tokens) || 0);
  }, 0) : 0;
  
  const ticketMedio = Array.isArray(transacoes) && transacoes.length > 0 ? totalInvestido / transacoes.length : 0;

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

  function getUserIdFromToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id || payload.user_id || payload.sub || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchInvestments = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('Faça login novamente.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await getInvestments(userId);
        
        if (response && Array.isArray(response)) {
          setTransacoes(response);
        } else if (response && typeof response === 'object') {
          setTransacoes([response]);
        } else {
          setTransacoes([]);
        }
      } catch (err) {
        console.error('Erro ao buscar investimentos:', err);
        setError(err?.response?.data?.message || err.message || 'Erro ao buscar investimentos');
        setTransacoes([]);
        toast.error('Erro ao carregar investimentos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const theme = document.documentElement.getAttribute('data-bs-theme');
        setIsDarkMode(theme === 'dark');
      }
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-bs-theme']
      });

      const handleThemeChange = () => checkDarkMode();
      document.addEventListener('theme-reload', handleThemeChange);

      return () => {
        observer.disconnect();
        document.removeEventListener('theme-reload', handleThemeChange);
      };
    }
  }, []);

  const chartData = {
    options: {
      chart: { 
        id: 'invest-chart', 
        toolbar: { show: false },
        background: 'transparent'
      },
      xaxis: {
        categories: Array.isArray(transacoes) ? transacoes.map(item => formatDateToBR(item?.data_compra)) : [],
        labels: { 
          rotate: -45, 
          style: { 
            fontSize: '12px',
            colors: isDarkMode ? '#adb5bd' : '#6c757d'
          } 
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? '#adb5bd' : '#6c757d'
          }
        }
      },
      colors: ['#0d6efd'],
      dataLabels: { enabled: false },
      grid: { 
        borderColor: isDarkMode ? '#495057' : '#e9ecef',
        row: {
          colors: ['transparent']
        }
      },
      tooltip: { 
        theme: isDarkMode ? 'dark' : 'light',
        y: { formatter: val => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` } 
      },
      theme: {
        mode: isDarkMode ? 'dark' : 'light'
      }
    },
    series: [
      {
        name: 'Valor Investido',
        data: Array.isArray(transacoes) ? transacoes.map(item => {
          const valorUnitario = Number(item?.valor_unitario) || 0;
          const qtdTokens = Number(item?.qtd_tokens) || 0;
          return valorUnitario * qtdTokens;
        }) : [],
      },
    ],
  };

  return (
    
      <div className="container-fluid py-4">
        <BreadCrumb items={[
          { label: 'Investimentos', path: '/investments' },
        ]} />
        
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="text-2xl mb-2 text-dark mt-3 fw-bold">
                  <i className="fa fa-chart-pie me-3 text-dark"></i>
                  Meus Investimentos
                </h1>
                <p className="text-muted mb-0">Acompanhe a evolução dos seus tokens imobiliários</p>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="text-muted">Carregando seus investimentos...</p>
          </div>
        )}
        
     

        {!loading && !error && (
          <>
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 investment-card gradient-purple">
                  <div className="card-body text-white p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="card-subtitle mb-2 text-white-50">Total Investido</h6>
                        <h3 className="mb-0 fw-bold money-value">
                          R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <small className="text-white-50 mt-1">
                          <i className="fa fa-arrow-up me-1"></i>
                          Patrimônio Total
                        </small>
                      </div>
                      <div className="investment-stat-icon bg-white bg-opacity-20">
                        <i className="fa fa-wallet text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 investment-card gradient-green">
                  <div className="card-body text-white p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="card-subtitle mb-2 text-white-50">Total de Tokens</h6>
                        <h3 className="mb-0 fw-bold money-value">{totalTokens}</h3>
                        <small className="text-white-50 mt-1">
                          <i className="fa fa-coins me-1"></i>
                          Unidades Possuídas
                        </small>
                      </div>
                      <div className="investment-stat-icon bg-white bg-opacity-20">
                        <i className="fa fa-coins text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 investment-card gradient-blue">
                  <div className="card-body text-white p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="card-subtitle mb-2 text-white-50">Ticket Médio</h6>
                        <h3 className="mb-0 fw-bold money-value">
                          R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <small className="text-white-50 mt-1">
                          <i className="fa fa-chart-line me-1"></i>
                          Por Investimento
                        </small>
                      </div>
                      <div className="investment-stat-icon bg-white bg-opacity-20">
                        <i className="fa fa-calculator text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header border-bottom-0 d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-1 fw-bold text-dark">
                        <i className="fa fa-chart-line me-2 text-primary"></i>
                        Evolução dos Investimentos
                      </h5>
                      <small className="text-muted">Histórico de compras de tokens por período</small>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-calendar me-1"></i>Período
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ minHeight: 320 }}>
                      {typeof window !== 'undefined' && transacoes.length > 0 ? (
                        <ApexChart 
                          key={`chart-${isDarkMode ? 'dark' : 'light'}`}
                          options={chartData.options} 
                          series={chartData.series} 
                          type="bar" 
                          height={320} 
                        />
                      ) : (
                        <div className="empty-state text-center">
                          <i className="fa fa-chart-line fa-3x text-muted"></i>
                          <h6 className="text-muted">Nenhum dado para exibir</h6>
                          <p className="text-muted">Faça seu primeiro investimento para ver o gráfico</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header  border-bottom-0 d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-1 fw-bold text-dark">
                        <i className="fa fa-list me-2 text-primary"></i>
                        Histórico de Compras
                      </h5>
                      <small className="text-muted">Detalhamento de todas as suas aquisições de tokens</small>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-filter me-1"></i>Filtrar
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-search me-1"></i>Buscar
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    {(!Array.isArray(transacoes) || transacoes.length === 0) ? (
                      <div className="empty-state text-center">
                        <i className="fa fa-inbox fa-3x text-muted"></i>
                        <h6 className="text-muted">Nenhum investimento encontrado</h6>
                        <p className="text-muted">Comece a investir em tokens imobiliários agora</p>
                        <button className="btn btn-primary">
                          <i className="fa fa-plus me-2"></i>Fazer Primeiro Investimento
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 investment-table">
                          <thead className="bg-light">
                            <tr>
                              <th className="border-0 fw-semibold text-dark">ID</th>
                              <th className="border-0 fw-semibold text-dark">Propriedade</th>
                              <th className="border-0 fw-semibold text-dark">Tokens</th>
                              <th className="border-0 fw-semibold text-dark">Valor Unitário</th>
                              <th className="border-0 fw-semibold text-dark">Total Investido</th>
                              <th className="border-0 fw-semibold text-dark">Status</th>
                              <th className="border-0 fw-semibold text-dark">Origem</th>
                              <th className="border-0 fw-semibold text-dark">Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transacoes.map((item) => (
                              <tr key={item?.id || Math.random()}>
                                <td className="fw-bold text-primary">#{item?.id || '-'}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="property-icon bg-primary bg-opacity-10 me-3">
                                      <i className="fa fa-building text-primary"></i>
                                    </div>
                                    <div>
                                      <div className="fw-semibold">Propriedade #{item?.id_imovel || '-'}</div>
                                      <small className="text-muted">Token Imobiliário</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark fs-6">{item?.qtd_tokens || 0}</span>
                                </td>
                                <td className="fw-semibold money-value">
                                  R$ {Number(item?.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="fw-bold text-success money-value">
                                  R$ {((Number(item?.valor_unitario || 0) * Number(item?.qtd_tokens || 0))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td>
                                  <span className={`badge ${(item?.status || '').toLowerCase() === 'ativo' ? 'status-active' : 'status-inactive'}`}>
                                    <i className={`fa ${(item?.status || '').toLowerCase() === 'ativo' ? 'fa-check-circle' : 'fa-pause-circle'} me-1`}></i>
                                    {item?.status || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-info">{item?.origem || 'Plataforma'}</span>
                                </td>
                                <td className="text-muted">{formatDateToBR(item?.data_compra)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    
  );
}