import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getInvestments } from '@/services/investments/getInvestments';
import { Colors } from 'chart.js';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function InvestimentosPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Totalizadores - com validação para evitar erros
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
    <div className=" py-4">
      <h1 className="text-3xl font-bold mb-4 text-dark">Minhas Compras de Tokens</h1>
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center bg-light">
            <div className="fw-bold text-muted mb-1">Total Investido</div>
            <div className="fs-4 fw-bold text-primary">R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center bg-light">
            <div className="fw-bold text-muted mb-1">Total de Tokens</div>
            <div className="fs-4 fw-bold text-success">{totalTokens}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center bg-light">
            <div className="fw-bold text-muted mb-1">Ticket Médio</div>
            <div className="fs-4 fw-bold text-info">R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="card shadow-sm border-0 p-3">
          <div className="fw-bold mb-2"><i className="fa fa-chart-line me-2 text-primary"></i>Evolução dos Investimentos</div>
          <div style={{ minHeight: 280 }}>
            {typeof window !== 'undefined' && transacoes.length > 0 ? (
              <ApexChart 
                key={`chart-${isDarkMode ? 'dark' : 'light'}`}
                options={chartData.options} 
                series={chartData.series} 
                type="bar" 
                height={280} 
              />
            ) : (
              <div className="text-muted text-center py-5">Sem dados para exibir o gráfico.</div>
            )}
          </div>
        </div>
      </div>
      {/* DataTable */}
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando compras...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-light shadow-sm rounded">
          <thead className="bg-secondary text-dark">
            <tr>
              <th>ID</th>
              <th>ID do Imóvel</th>
              <th>Qtd. Tokens</th>
              <th>Valor unitário (R$)</th>
              <th>Total (R$)</th>
              <th>Status</th>
              <th>Origem</th>
              <th>Data da Compra</th>
            </tr>
          </thead>
          <tbody>
            {(!loading && (!Array.isArray(transacoes) || transacoes.length === 0)) && (
              <tr>
                <td colSpan={8} className="text-center text-muted">Nenhuma compra encontrada.</td>
              </tr>
            )}
            {Array.isArray(transacoes) && transacoes.map((item) => (
              <tr key={item?.id || Math.random()}>
                <td>{item?.id || '-'}</td>
                <td>{item?.id_imovel || '-'}</td>
                <td>{item?.qtd_tokens || 0}</td>
                <td>R$ {Number(item?.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>R$ {((Number(item?.valor_unitario || 0) * Number(item?.qtd_tokens || 0))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs fw-semibold ${(item?.status || '').toLowerCase() === 'ativo' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{item?.status || 'N/A'}</span>
                </td>
                <td>{item?.origem || '-'}</td>
                <td>{formatDateToBR(item?.data_compra)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
