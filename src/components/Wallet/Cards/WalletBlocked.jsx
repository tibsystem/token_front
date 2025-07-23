
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallet } from '@/services/wallet/getWallet';
import { getUserIdFromToken } from '@/utils/auth';
import { CgSpinner } from 'react-icons/cg';
import { FaBan } from 'react-icons/fa';

export default function WalletBlocked() {
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
        <p className="text-danger">Erro ao carregar saldo bloqueado.</p>
      </div>
    );
  }

  const blocked = wallet?.saldo_bloqueado ?? 0;
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
          background: 'linear-gradient(135deg, #000 0%, #23272f 60%, #222 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: -10, top: -40, opacity: 0.10, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
          <FaBan style={{ color: '#fff' }} />
        </div>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Saldo bloqueado</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {blocked.toLocaleString('pt-BR', { style: 'currency', currency })}
          </span>
        </div>
        <p className="mb-1" style={{ color: '#bbb', fontSize: 12 }}>Em processamento</p>
      </div>
    </div>
  );
}
