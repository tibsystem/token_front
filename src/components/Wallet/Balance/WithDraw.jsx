
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getWallet } from '@/services/wallet/getWallet';
import { postWithdrawFunds } from '@/services/wallet/postWithDrawFonds';
import { getUserIdFromToken } from '@/utils/auth';

export default function WalletWithdraw() {
  const userId = getUserIdFromToken();
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => getWallet(userId),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: ({ userId, amount }) => postWithdrawFunds(userId, amount),
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg('');
      setAmount('');
    },
    onError: (err) => {
      setSuccess(false);
      setErrorMsg(err?.response?.data?.message || 'Erro ao sacar.');
    },
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setErrorMsg('Informe um valor válido.');
      return;
    }
    if (Number(amount) > (wallet?.balance ?? 0)) {
      setErrorMsg('Saldo insuficiente.');
      return;
    }
    mutation.mutate({ userId, amount: Number(amount) });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 320, width: '100%' }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        borderRadius: 18,
        background: 'linear-gradient(135deg, #23272f 0%, #111 100%)',
        boxShadow: '0 2px 16px 0 #0002',
        padding: 32,
        color: '#fff',
        position: 'relative',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 15, color: '#b2dfdb', marginBottom: 8, fontWeight: 500 }}>
          Seu saldo disponível
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 18, letterSpacing: 1 }}>
          {isLoading ? '...' : (wallet?.balance ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: wallet?.currency || 'BRL' })}
        </div>
        <form onSubmit={handleWithdraw} autoComplete="off">
          <label htmlFor="withdraw-amount" style={{ fontSize: 14, color: '#bbb', marginBottom: 4, display: 'block' }}>Valor para saque</label>
          <input
            id="withdraw-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Digite o valor"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1.5px solid #444',
              background: '#181a20',
              color: '#fff',
              fontSize: 18,
              marginBottom: 16,
              outline: 'none',
              fontWeight: 500,
              boxSizing: 'border-box',
              transition: 'border 0.2s',
            }}
            disabled={mutation.isLoading}
          />
          <button
            type="submit"
            className="btn w-100 mt-2"
            style={{
              background: 'linear-gradient(90deg, #1976d2 0%, #43a047 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 18,
              padding: '12px 0',
              boxShadow: '0 2px 8px 0 #1976d222',
              transition: 'background 0.18s',
              letterSpacing: 0.5,
            }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Processando...' : 'Confirmar Saque'}
          </button>
        </form>
        {success && (
          <div className="alert alert-success mt-3" style={{ fontSize: 15, borderRadius: 8, padding: 10 }}>
            Saque realizado com sucesso!
          </div>
        )}
        {errorMsg && (
          <div className="alert alert-danger mt-3" style={{ fontSize: 15, borderRadius: 8, padding: 10 }}>
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}