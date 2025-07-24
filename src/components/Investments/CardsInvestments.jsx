


import React from 'react';
import { FaMoneyCheck, FaCoins, FaCalculator } from 'react-icons/fa';

export default function CardsInvestments({ totalInvestido = 0, totalTokens = 0, ticketMedio = 0 }) {
  return (
    <div className="row g-4 mb-5" style={{ justifyContent: 'center' }}>
      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 investment-card flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #4b006e 0%, #8e24aa 60%, #6a1b9a 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            <FaMoneyCheck style={{ color: '#fff' }} />
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Total Investido</h6>
                <h3 className="mb-0 fw-bold money-value" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                  R${" "}
                  {totalInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
                <small className="mt-1" style={{ color: '#bdbdbd', fontSize: 13 }}>
                  Patrimônio Total
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Total de Tokens */}
      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 investment-card flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #0a2a43 0%, #1976d2 60%, #0d47a1 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            <FaCoins style={{ color: '#fff' }} />
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Total de Tokens</h6>
                <h3 className="mb-0 fw-bold money-value" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{totalTokens}</h3>
                <small className="mt-1" style={{ color: '#bdbdbd', fontSize: 13 }}>
                  Unidades Possuídas
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Ticket Médio */}
      <div className="col-xl-4 col-md-6 col-12 d-flex">
        <div
          className="card shadow-lg border-0 investment-card flex-fill"
          style={{
            borderRadius: 20,
            minHeight: 70,
            maxWidth: 420,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #000 0%, #23272f 60%, #222 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
            <FaCalculator style={{ color: '#fff' }} />
          </div>
          <div className="card-body text-white p-4" style={{ padding: 18 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-subtitle mb-2" style={{ color: '#e0e0e0', fontWeight: 500, fontSize: 15 }}>Ticket Médio</h6>
                <h3 className="mb-0 fw-bold money-value" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                  R${" "}
                  {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
                <small className="mt-1" style={{ color: '#bdbdbd', fontSize: 13 }}>
                  Por Investimento
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}