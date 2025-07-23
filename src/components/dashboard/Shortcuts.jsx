import React, { useState } from 'react';
import { FaHome, FaPiggyBank, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

const shortcuts = [
  {
    label: 'Imóveis',
    icon: <FaHome size={32} color="#1976d2" />,
    href: '/properties',
    color: '#1976d2',
  },
  {
    label: 'Investir',
    icon: <FaPiggyBank size={32} color="#43a047" />,
    href: '/investments',
    color: '#43a047',
  },
  {
    label: 'Sacar',
    icon: <FaArrowDown size={32} color="#fbc02d" />,
    href: '/wallet',
    color: '#fbc02d',
  },
  {
    label: 'P2P',
    icon: <FaExchangeAlt size={32} color="#8e24aa" />,
    href: '/p2p',
    color: '#8e24aa',
  },
];

export default function Shortcuts() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  return (
    <div className="d-flex justify-content-between flex-wrap gap-3 mb-4" style={{ rowGap: 18 }}>
      {shortcuts.map((item, idx) => (
        <button
          key={idx}
          className="btn d-flex flex-column align-items-center justify-content-center shadow-sm"
          style={{
            background: hovered === idx ? '#f5f7fa' : '#fff',
            color: '#222',
            borderRadius: 18,
            fontWeight: 500,
            fontSize: 14,
            border: hovered === idx ? `1.5px solid ${item.color}` : '1.5px solid #e0e0e0',
            minWidth: 110,
            minHeight: 110,
            boxShadow: hovered === idx ? `0 4px 18px 0 ${item.color}22` : '0 1px 6px rgba(0,0,0,0.07)',
            outline: hovered === idx ? `2px solid ${item.color}` : 'none',
            transition: 'all 0.18s',
            cursor: 'pointer',
            letterSpacing: 0.1,
            padding: 0,
            margin: 0,
            gap: 8,
          }}
          onClick={() => router.push(item.href)}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(idx)}
          onBlur={() => setHovered(null)}
          tabIndex={0}
          aria-label={item.label}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
            {item.icon}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
