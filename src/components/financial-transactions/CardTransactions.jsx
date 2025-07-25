import React from 'react';
import { FaList, FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';

export default function CardTransactions({ transacoes = [], totalTransacoes = 0, formatDateTime }) {
  const lastDate = transacoes.length > 0 ? formatDateTime(transacoes[0]?.created_at || transacoes[0]?.data_transacao) : '-';
  return (
    <div className="row g-4 mb-5" style={{ justifyContent: 'center' }}>
      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            <FaList style={{ color: '#fff' }} />
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Total de Transações</h6>
                <h3 className="mb-0 fw-bold" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{transacoes.length}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: totalTransacoes >= 0
              ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
              : 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            {totalTransacoes >= 0 ? <FaArrowUp style={{ color: '#fff' }} /> : <FaArrowDown style={{ color: '#fff' }} />}
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Saldo Total</h6>
                <h3 className="mb-0 fw-bold" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                  R$ {Math.abs(totalTransacoes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            <FaClock style={{ color: '#fff' }} />
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Última Transação</h6>
                <p className="mb-0 fw-semibold" style={{ fontSize: 22, color: '#fff' }}>{lastDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
