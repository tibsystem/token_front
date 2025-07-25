"use client";

import React, { useState, useEffect, useRef } from 'react';
import useDarkMode from "@/hooks/useDarkMode";
import { useRouter } from 'next/router'; 

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

function getTipoLabel(tipo) {
  const labels = {
    'compra_token': 'Compra de Token',
    'venda_token': 'Venda de Token',
    'deposito': 'Depósito',
    'saque': 'Saque',
    'transferencia': 'Transferência',
    'rendimento': 'Rendimento'
  };
  return labels[tipo] || 'Transação';
}

const lightTheme = {
  bg: '#fff',
  cardBg: '#fff', 
  hoverBg: '#f5f7fa',
  textColor: '#212529',
  secondaryTextColor: '#6c757d',
  iconColor: '#333',
  iconBg: '#e9ecef',
  borderColor: '#e9ecef', 
  dropdownBg: '#f1f3f5', 
  dropdownShadow: '0 4px 8px rgba(0,0,0,0.1)',
  dropdownHoverBg: '#f8f9fa',
};

const darkTheme = {
  bg: '#1C1C1E',
  cardBg: '#1C1C1E',
  hoverBg: '#2C2C2E',
  textColor: '#f8f9fa',
  secondaryTextColor: '#adb5bd',
  iconColor: '#f8f9fa',
  iconBg: '#3A3A3C',
  borderColor: '#3A3A3C',
  dropdownBg: '#2C2C2E',
  dropdownShadow: '0 4px 8px rgba(0,0,0,0.2)',
  dropdownHoverBg: '#3A3A3C',
};

export default function RecentTransactions({ transactions = [], title = "Transação Recentes" }) {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
const menuRef = useRef(null)
  const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleMenuToggle = (transactionId) => {
    setOpenMenuId(currentId => (currentId === transactionId ? null : transactionId));
  };

  return (
    <div style={{
      background: theme.cardBg,
      padding: '24px',
      borderRadius: '24px',
      boxShadow: isDarkMode ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)',
      transition: 'background 0.3s',
      minHeight: '240px',
      maxHeight: '240px',
      height: '420px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h3 style={{
        fontWeight: 700,
        fontSize: '20px',
        color: theme.textColor,
        marginBottom: '24px',
        flex: '0 0 auto',
      }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: '1 1 0', minHeight: 0 }}>
        {transactions.map((transaction, index) => {
          const iconClassName = getTipoIcon(transaction.tipo);
          const label = getTipoLabel(transaction.tipo);
          const isHovered = hoveredIndex === index;

          return (
            <div key={transaction.id} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '16px', background: isHovered ? theme.hoverBg : 'transparent', border: `1px solid ${isHovered ? theme.borderColor : 'transparent'}`, transition: 'background 0.2s, border 0.2s' }}>
              <div style={{ background: theme.iconBg, color: theme.iconColor, borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa ${iconClassName}`} style={{ fontSize: '18px' }}></i>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 600, color: theme.textColor }}>{label}</div>
                <div style={{ fontSize: '14px', color: theme.secondaryTextColor }}>{new Date(transaction.data_transacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: theme.textColor }}>
                R$ {Number(transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              
              <div style={{ position: 'relative' }} ref={openMenuId === transaction.id ? menuRef : null}>
                <button onClick={() => handleMenuToggle(transaction.id)} style={{ background: 'none', border: 'none', color: theme.secondaryTextColor, cursor: 'pointer', padding: '8px' }}>
                  <i className="fa fa-ellipsis-v"></i>
                </button>
                
                {openMenuId === transaction.id && (
                  <div style={{ position: 'absolute', top: '100%', right: '0', background: theme.dropdownBg, borderRadius: '8px', boxShadow: theme.dropdownShadow, zIndex: 10, minWidth: '150px', overflow: 'hidden' }}>
                    <button
                      onClick={() => router.push(`/financial-transactions/`)}
                      style={{
                        background: theme.dropdownBg, border: 'none', color: theme.textColor, cursor: 'pointer', padding: '10px 15px', width: '100%', textAlign: 'left',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.dropdownHoverBg}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Ver detalhes
                    </button>
                  </div>
                )}
              </div>
            </div>
       
          );
        })}
      </div>
    </div>
  );
}