

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallet } from '@/services/wallet/getWallet';
import { getUserIdFromToken } from '@/utils/auth';
import { CgSpinner } from 'react-icons/cg';
import { FaMoneyCheck } from "react-icons/fa";

export default function WalletBallance() {
  const userId = getUserIdFromToken();
  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => getWallet(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
        <CgSpinner className="fa fa-spin text-dark" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
        <p className="text-danger">Erro ao carregar saldo da carteira.</p>
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const currency = wallet?.currency || 'BRL';

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: 16 }}>
      <div
        className="card shadow-lg border-0"
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 20,
          padding: 18,
          minHeight: 70,
          background: 'linear-gradient(135deg, #0a2a43 0%, #1976d2 60%, #0d47a1 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute',  right: -10, top: -40, opacity: 0.08, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
          <FaMoneyCheck style={{ color: '#fff' }} />
        </div>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Saldo disponível</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {balance.toLocaleString('pt-BR', { style: 'currency', currency })}
          </span>
        </div>
        <p className="mb-1" style={{ color: '#bbb', fontSize: 12 }}>Atualizado em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}