"use client";

import React from "react";
import dynamic from "next/dynamic";
import useDarkMode from "@/hooks/useDarkMode";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BalanceEvolution({ investments = [] }) {
  const { isDarkMode } = useDarkMode();

  const lightTheme = {
    bg: '#fff',
    textColor: '#222',
    lineColor: "#0d6efd",
    gridColor: "#e9ecef"
  };
  const darkTheme = {
    bg: '#1C1C1E',
    textColor: '#f8f9fa',
    lineColor: "#0d6efd",
    gridColor: "#3A3A3C"
  };
  const theme = isDarkMode ? darkTheme : lightTheme;

  const saldoPorMes = {};
  const arrInvestments = Array.isArray(investments) ? investments : [];
  arrInvestments.forEach(item => {
    const rawDate = item.data_investimento || item.data_transacao;
    const valueRaw = item.valor ?? item.saldo;
    const value = Number(valueRaw);
    if (!rawDate) return;
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return; 
    if (isNaN(value)) return; 
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    saldoPorMes[key] = (saldoPorMes[key] || 0) + value;
  });
  const sortedKeys = Object.keys(saldoPorMes).sort();
  let acumulado = 0;
  const seriesData = sortedKeys.map(key => {
    acumulado += saldoPorMes[key];
    return { x: key, y: acumulado };
  });

  const options = {
    chart: {
      type: 'line',
      background: theme.bg,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'category',
      categories: sortedKeys,
      labels: { style: { colors: theme.textColor } }
    },
    yaxis: {
      labels: { style: { colors: theme.textColor } }
    },
    grid: {
      borderColor: theme.gridColor
    },
    colors: [theme.lineColor],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      y: {
        formatter: val => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      }
    },
    dataLabels: { enabled: false },
    title: {
      text: '',
      style: { color: theme.textColor }
    }
  };

  return (
    <div style={{ background: theme.bg, borderRadius: 24, padding: 24, minHeight: 400, boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, color: theme.textColor, marginBottom: 24 }}>
        Evolução do Saldo Investido
      </h3>
      {seriesData.length === 0 ? (
        <div style={{ color: theme.textColor, textAlign: 'center', padding: '48px 0', fontSize: 16 }}>
          Nenhum dado disponível para exibir o gráfico.
        </div>
      ) : (
        <ReactApexChart options={options} series={[{ name: 'Saldo', data: seriesData }]} type="line" height={320} />
      )}
    </div>
  );
}
