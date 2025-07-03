import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { getFinancialTransactions } from '../services/financialTransactions/getFinancialTransactions';

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

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Hoje';
  }
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Ontem';
  }
  return date.toLocaleDateString('pt-BR');
}

export default function TransacoesFinanceirasPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError('ID do usuário não encontrado no token. Faça login novamente.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = getFinancialTransactions();
      setTransacoes(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erro ao buscar transações financeiras');
    } finally {
      setLoading(false);
    }
  }, []);

  // Agrupa por data
  const transacoesPorData = transacoes.reduce((acc, t) => {
    const data = formatDate(t.data_transacao);
    if (!acc[data]) acc[data] = [];
    acc[data].push(t);
    return acc;
  }, {});

  // Ordena datas (mais recente primeiro)
  const datasOrdenadas = Object.keys(transacoesPorData).sort((a, b) => {
    if (a === 'Hoje') return -1;
    if (b === 'Hoje') return 1;
    if (a === 'Ontem') return -1;
    if (b === 'Ontem') return 1;
    // datas no formato dd/mm/yyyy
    const [da, ma, ya] = a.split('/').map(Number);
    const [db, mb, yb] = b.split('/').map(Number);
    return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
  });

  function isCredito(tipo) {
    return [
      'depósito',
      'venda',
      'recebimento',
      'transferência recebida',
      'rendimento',
      'resgate',
      'crédito',
    ].includes(tipo?.toLowerCase());
  }

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-6 text-theme">Extrato Financeiro</h1>
      {loading && <div className="text-gray-500 mb-4 animate-pulse">Carregando transações...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {transacoes.length === 0 && !loading && <div className="text-gray-500">Nenhuma transação encontrada.</div>}
      <div className="timeline">
        {datasOrdenadas.map((data) => (
          <div key={data} className="mb-5">
            <div className="fw-bold text-secondary mb-3 fs-6">{data}</div>
            <ul className="list-unstyled">
              {transacoesPorData[data].map((item) => (
                <li key={item.id} className="d-flex align-items-center mb-4 p-3 rounded shadow-sm bg-white border position-relative">
                  <div className={`me-3 d-flex align-items-center justify-content-center rounded-circle ${isCredito(item.tipo) ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ width: 48, height: 48, fontSize: 22 }}>
                    <i className={`fa ${isCredito(item.tipo) ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold mb-1">
                      {item.tipo?.charAt(0).toUpperCase() + item.tipo?.slice(1)}
                      <span className="ms-2 badge bg-light text-dark border border-gray-200">{item.status}</span>
                    </div>
                    <div className="text-muted small mb-1">{item.referencia}</div>
                    <div className="text-muted small">{item.data_transacao}</div>
                  </div>
                  <div className={`fw-bold fs-5 ${isCredito(item.tipo) ? 'text-success' : 'text-danger'}`}
                    style={{ minWidth: 120, textAlign: 'right' }}>
                    {isCredito(item.tipo) ? '+' : '-'} R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
