import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getInvestments } from '../services/investments/getInvestments';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function InvestimentosPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Totalizadores
  const totalInvestido = transacoes.reduce((acc, item) => acc + (Number(item.valor_unitario) * Number(item.qtd_tokens)), 0);
  const totalTokens = transacoes.reduce((acc, item) => acc + Number(item.qtd_tokens), 0);
  const ticketMedio = transacoes.length > 0 ? totalInvestido / transacoes.length : 0;

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
    const userId = getUserIdFromToken();
    if (!userId) {
      setError('ID do usuário não encontrado no token. Faça login novamente.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = getInvestments(userId);
      setTransacoes(Array.isArray(response) ? response : [response]);
    } catch (err) {
      // console.error('Erro ao buscar investimentos:', err);
      setError(err?.response?.data?.message || err.message || 'Erro ao buscar investimentos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Dados para o gráfico (evolução por data)
  const chartData = {
    options: {
      chart: { id: 'invest-chart', toolbar: { show: false } },
      xaxis: {
        categories: transacoes.map(item => item.data_compra),
        labels: { rotate: -45, style: { fontSize: '12px' } },
      },
      colors: ['#0d6efd'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#e9ecef' },
      tooltip: { y: { formatter: val => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` } },
    },
    series: [
      {
        name: 'Valor Investido',
        data: transacoes.map(item => Number(item.valor_unitario) * Number(item.qtd_tokens)),
      },
    ],
  };

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-4 text-theme">Minhas Compras de Tokens</h1>
      {/* Totalizadores */}
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
      {/* Gráfico de evolução */}
      <div className="mb-4">
        <div className="card shadow-sm border-0 p-3">
          <div className="fw-bold mb-2"><i className="fa fa-chart-line me-2 text-primary"></i>Evolução dos Investimentos</div>
          <div style={{ minHeight: 280 }}>
            {typeof window !== 'undefined' && transacoes.length > 0 ? (
              <ApexChart options={chartData.options} series={chartData.series} type="bar" height={280} />
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
        <table className="table table-bordered table-hover align-middle bg-white shadow-sm rounded">
          <thead className="table-light">
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
            {(!loading && transacoes.length === 0) && (
              <tr>
                <td colSpan={8} className="text-center text-muted">Nenhuma compra encontrada.</td>
              </tr>
            )}
            {transacoes.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.id_imovel}</td>
                <td>{item.qtd_tokens}</td>
                <td>R$ {Number(item.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>R$ {(Number(item.valor_unitario) * Number(item.qtd_tokens)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs fw-semibold ${item.status === 'ativo' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{item.status}</span>
                </td>
                <td>{item.origem}</td>
                <td>{item.data_compra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
