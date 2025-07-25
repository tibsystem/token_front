/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import BreadCrumb from '@/components/breadcrumb/breadcrumb';
// utils
import { getUserIdFromToken } from '@/utils/auth';
// services
import { getFinancialTransactions } from '@/services/financialTransactions/getFinancialTransactions';
import CardTransactions from '../../components/financial-transactions/CardTransactions';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return 'Hoje';
  }
  if (date.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }
  return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function FinancialTransactionsPage() {

  const userId = getUserIdFromToken();
  const {
    data: transacoes = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['financialTransactions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado.');
      const response = await getFinancialTransactions();
      return Array.isArray(response) ? response : [];
    },
    enabled: !!userId,
  });

  const transacoesPorData = useMemo(() => {
    return transacoes.reduce((acc, t) => {
      const data = formatDate(t.created_at || t.data_transacao);
      if (!acc[data]) acc[data] = [];
      acc[data].push(t);
      return acc;
    }, {});
  }, [transacoes]);

  const datasOrdenadas = useMemo(() => {
    return Object.keys(transacoesPorData).sort((a, b) => {
      if (a === 'Hoje') return -1;
      if (b === 'Hoje') return 1;
      if (a === 'Ontem') return -1;
      if (b === 'Ontem') return 1;
      const [da, ma, ya] = a.split('/').map(Number);
      const [db, mb, yb] = b.split('/').map(Number);
      return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
    });
  }, [transacoesPorData]);

  function isCredito(tipo) {
    return [
      'depósito',
      'venda',
      'recebimento',
      'transferência recebida',
      'rendimento',
      'resgate',
      'crédito',
      'venda_token'
    ].includes(tipo?.toLowerCase());
  }

  function getTipoDisplay(tipo) {
    const tipos = {
      'compra_token': 'Compra de Token',
      'venda_token': 'Venda de Token',
      'deposito': 'Depósito',
      'saque': 'Saque',
      'transferencia': 'Transferência',
      'rendimento': 'Rendimento'
    };
    return tipos[tipo] || tipo?.charAt(0).toUpperCase() + tipo?.slice(1);
  }

  function getTipoIcon(tipo) {
    const icons = {
      'compra_token': 'fa-coins',
      'venda_token': 'fa-hand-holding-usd',
      'deposito': 'fa-plus-circle',
      'saque': 'fa-minus-circle',
      'transferencia': 'fa-exchange-alt',
      'rendimento': 'fa-chart-line'
    };
    return icons[tipo] || 'fa-money-bill-wave';
  }

  const totalTransacoes = transacoes.reduce((total, item) => {
    const valor = Number(item.valor);
    return isCredito(item.tipo) ? total + valor : total - valor;
  }, 0);

  return (
      

    <div className="py-4">
      <BreadCrumb items={[
        { label: 'Extrato Financeiro', path: '/financial-transactions' },
      ]} />
      
      <div className="d-flex align-items-center justify-content-between mt-3 mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">
            Extrato Financeiro
          </h1>
          <p className="text-muted mb-0">Acompanhe todas as suas movimentações financeiras</p>
        </div>
      </div>

      {transacoes.length > 0 && !loading && (
      <>
      <CardTransactions
  transacoes={transacoes}
  totalTransacoes={totalTransacoes}
  formatDateTime={formatDateTime}
/></>
      )}
      
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark mb-3" role="status">
          </div>
          <p className="text-muted">Carregando transações...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <i className="fa fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      )}
      
      {transacoes.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fa fa-inbox text-muted mb-3" style={{ fontSize: '4rem' }}></i>
          <h4 className="text-muted">Nenhuma transação encontrada</h4>
          <p className="text-muted">Quando você realizar transações, elas aparecerão aqui.</p>
        </div>
      )}
      <div className="">
        {datasOrdenadas.map((data) => (
          <div key={data} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-dark text-white rounded-pill px-3 py-1 fw-semibold small">
                <i className="fa fa-calendar me-2"></i>
                {data}
              </div>
              <div className="flex-grow-1 ms-3" style={{ height: '1px', backgroundColor: '#e9ecef' }}></div>
            </div>
            <div className="row g-3">
              {transacoesPorData[data].map((item) => (
                <div key={item.id} className="col-12">
                  <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                    <div className={`position-absolute top-0 start-0 h-100 ${isCredito(item.tipo) ? 'bg-success' : 'bg-danger'}`} style={{ width: '4px' }}></div>
                    <div className="card-body p-4" style={{ minHeight: '120px' }}>
                      <div className="d-flex align-items-center h-100">
                        <div className={`me-4 d-flex align-items-center justify-content-center rounded-circle ${isCredito(item.tipo) ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ width: 64, height: 64, fontSize: 26 }}>
                          <i className={`fa ${isCredito(item.tipo) ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-3">
                            <h5 className="mb-0 fw-bold text-dark me-3" style={{ fontSize: '1.1rem' }}>
                              {getTipoDisplay(item.tipo)}
                            </h5>
                            <span className={`badge ${item.status === 'concluido' ? 'bg-success' : item.status === 'pendente' ? 'bg-warning' : 'bg-secondary'} text-white`}>
                              <i className={`fa ${item.status === 'concluido' ? 'fa-check' : item.status === 'pendente' ? 'fa-clock' : 'fa-times'} me-1`}></i>
                              {item.status}
                            </span>
                          </div>
                          <div className="d-flex align-items-center text-muted mb-2">
                            <i className="fa fa-tag me-2"></i>
                            <span className="me-4">{item.referencia}</span>
                            <i className="fa fa-clock me-2"></i>
                            <span>{formatDateTime(item.created_at || item.data_transacao)}</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className={`fw-bold ${isCredito(item.tipo) ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.35rem' }}>
                            {isCredito(item.tipo) ? '+' : '-'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {isCredito(item.tipo) ? 'Entrada' : 'Saída'}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
        

  );
}