"use client";

import React from "react";
import dynamic from "next/dynamic";
import useDarkMode from "@/hooks/useDarkMode";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TransactionsTypes({ transactions = [] }) {
  const { isDarkMode } = useDarkMode();

  const lightTheme = {
    bg: '#fff',
    textColor: '#222',
    chartColors: ["#0d6efd", "#6c757d", "#198754", "#ffc107", "#dc3545", "#6610f2"]
  };
  const darkTheme = {
    bg: '#1C1C1E',
    textColor: '#f8f9fa',
    chartColors: ["#0d6efd", "#adb5bd", "#20c997", "#f8f9fa", "#fd7e14", "#d63384"]
  };
  const theme = isDarkMode ? darkTheme : lightTheme;

  const typeMap = {
    compra_token: "Compra",
    venda_token: "Venda",
    deposito: "Depósito",
    saque: "Saque",
    transferencia: "Transferência",
    rendimento: "Rendimento"
  };
  const counts = {};
  transactions.forEach(t => {
    const tipo = typeMap[t.tipo] || "Outro";
    counts[tipo] = (counts[tipo] || 0) + 1;
  });
  const labels = Object.keys(counts);
  const series = labels.map(label => counts[label]);

  const options = {
    chart: {
      type: 'pie',
      background: theme.bg,
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
      palette: 'palette1',
      monochrome: false
    },
    labels,
    colors: theme.chartColors,
    legend: {
      labels: { colors: theme.textColor }
    },
    dataLabels: {
      style: { colors: [theme.textColor] }
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light'
    },
  };

  return (
    <div style={{ background: theme.bg, borderRadius: 24, padding: 24, minHeight: 400, boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, color: theme.textColor, marginBottom: 24 }}>
        Distribuição das Transações
      </h3>
      <ReactApexChart options={options} series={series} type="pie" height={320} />
    </div>
  );
}
