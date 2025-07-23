
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallet } from '@/services/wallet/getWallet';
import { getUserIdFromToken } from '@/utils/auth';
import { CgSpinner } from 'react-icons/cg';
import { GiToken } from "react-icons/gi";

export default function WalletTokenized() {
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
        <p className="text-danger">Erro ao carregar saldo tokenizado.</p>
      </div>
    );
  }

  const tokenized = Array.isArray(wallet?.saldo_tokenizado) && wallet.saldo_tokenizado.length > 0
    ? wallet.saldo_tokenizado.reduce((acc, item) => acc + Number(item), 0)
    : 0;
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
          background: 'linear-gradient(135deg, #4b006e 0%, #8e24aa 60%, #6a1b9a 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute',  right: -10, top: -30, opacity: 0.10, fontSize: 150, userSelect: 'none', pointerEvents: 'none' }}>
          <GiToken style={{ color: '#fff' }} />
        </div>
        <h2 className="mb-1" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>Saldo tokenizado</h2>
        <div className="d-flex align-items-end mb-2" style={{ gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {tokenized.toLocaleString('pt-BR', { style: 'currency', currency })}
          </span>
        </div>
        <p className="mb-1" style={{ color: '#bbb', fontSize: 12 }}>Tokens em carteira</p>
      </div>
    </div>
  );
}
