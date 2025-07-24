"use client";

import React, { useState } from 'react';
import useDarkMode from "@/hooks/useDarkMode";
import { useRouter } from 'next/router';
import { FaHome, FaPiggyBank, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';

const shortcuts = [
{ label: 'Imóveis', icon: FaHome, href: '/properties' },
{ label: 'Investir', icon: FaPiggyBank, href: '/investments' },
{ label: 'Sacar', icon: FaArrowDown, href: '/wallet' },
{ label: 'P2P', icon: FaExchangeAlt, href: '/p2p' },
];

const lightTheme = {
panelBg: '#fff',
panelShadow: '0 4px 24px rgba(0,0,0,0.06)',
buttonBg: '#f5f7fa',
buttonHoverBg: '#e9ecef',
textColor: '#222',
iconColor: '#222',
borderColor: '#f5f7fa',
hoverBorderColor: '#0d6efd',
};

const darkTheme = {
panelBg: '#1C1C1E',
panelShadow: '0 8px 32px rgba(0,0,0,0.2)',
buttonBg: '#2C2C2E',
buttonHoverBg: '#3A3A3C',
textColor: '#f8f9fa',
iconColor: '#f8f9fa',
borderColor: '#2C2C2E',
hoverBorderColor: '#0d6efd',
};

export default function Shortcuts() {
const router = useRouter();
const { isDarkMode } = useDarkMode();
const [hoveredIndex, setHoveredIndex] = useState(null);

const theme = isDarkMode ? darkTheme : lightTheme;

const panelStyle = {
  background: theme.panelBg,
  borderRadius: 24,
  padding: '24px',
  boxShadow: theme.panelShadow,
  transition: 'background 0.3s, box-shadow 0.3s',
  minHeight: '240px',
};

return (
  <div style={panelStyle}>
    <h3 style={{
      fontWeight: 700,
      fontSize: '20px',
      color: theme.textColor,
      marginBottom: '24px'
    }}>
      Atalhos
    </h3>
    <div className="d-flex gap-4 flex-wrap justify-content-center align-items-center">
      {shortcuts.map((item, index) => {
        const IconComponent = item.icon;
        const isHovered = hoveredIndex === index;
        const buttonStyle = {
          background: isHovered ? theme.buttonHoverBg : theme.buttonBg,
          color: theme.textColor,
          border: `1.5px solid ${isHovered ? theme.hoverBorderColor : theme.borderColor}`,
          borderRadius: 18,
          boxShadow: isHovered ? `0 4px 12px rgba(0,0,0,0.1)` : 'none',
          minWidth: 110,
          minHeight: 110,
          padding: '16px 8px',
          transition: 'all 0.2s ease-in-out',
          transform: isHovered ? 'translateY(-3px)' : 'none',
        };
        return (
          <button
            key={index}
            className="btn d-flex flex-column align-items-center justify-content-center"
            style={buttonStyle}
            onClick={() => router.push(item.href)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            aria-label={item.label}
          >
            <span style={{ marginBottom: 8 }}>
              <IconComponent size={30} color={theme.iconColor} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
}