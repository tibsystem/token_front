import { useMemo } from "react";
import dynamic from "next/dynamic";
import useDarkMode from "@/hooks/useDarkMode";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const lightTheme = {
  bg: '#fff',
  titleColor: '#222',
  subtitleColor: '#888',
  chartColor: '#348fe2',
  gridBorderColor: 'rgba(0,0,0,0.08)',
  apexThemeMode: 'light',
};

const darkTheme = {
  bg: '#1C1C1E', 
  titleColor: '#fff',
  subtitleColor: '#888',
  chartColor: '#fff', 
  gridBorderColor: 'rgba(255,255,255,0.08)',
  apexThemeMode: 'dark',
};

export default function DashboardChart({ graficoData }) {
  const { isDarkMode } = useDarkMode();

  const theme = isDarkMode ? darkTheme : lightTheme;


  const formatDateBR = (dateStr) => {
    const date = new Date(dateStr);
    if (!isNaN(date)) {
      return date.toLocaleDateString("pt-BR");
    }
    return dateStr;
  };

  const chartOptions = useMemo(() => ({
    chart: {
      id: "valor-negociado",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories: graficoData.categories.map(formatDateBR),
      labels: {
        style: {
          colors: theme.titleColor,
          fontWeight: 500,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "14px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `R$ ${Number(val).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        style: {
          colors: theme.titleColor,
          fontWeight: 500,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "14px",
        },
      },
    },
    colors: [theme.chartColor],
    dataLabels: { enabled: false },
    grid: {
      borderColor: theme.gridBorderColor, 
      strokeDashArray: 3,
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shade: theme.apexThemeMode, 
        type: "vertical",
        shadeIntensity: 0.2,
        gradientToColors: [theme.chartColor], 
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    theme: { mode: theme.apexThemeMode }, 
    tooltip: {
      y: {
        formatter: (val) => `R$ ${Number(val).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      },
    },
  }), [theme, graficoData]); 

  return (
    <div
      style={{
        background: theme.bg,
        borderRadius: 32,
        boxShadow: theme.shadow,
        padding: "40px 32px 32px 32px",
        minHeight: 540,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        transition: "background 0.3s, box-shadow 0.3s",
        maxWidth: 1200,
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          marginBottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <h3
          style={{
            fontWeight: 700,
            fontSize: 24,
            marginBottom: 4,
            color: theme.titleColor,
            fontFamily: "Inter, Arial, sans-serif",
            letterSpacing: "-1px",
          }}
        >
          Valor negociado
        </h3>
        <span style={{ color: theme.subtitleColor, fontSize: 15, fontWeight: 500 }}>
          Nos últimos dias
        </span>
      </div>
      <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {graficoData.categories.length > 0 ? (
          <ApexChart
            type="area"
            height={400}
            width={1000}
            options={{
              ...chartOptions,
              stroke: { curve: 'smooth', width: 3 },
            }}
            series={graficoData.series}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <i className="fa fa-chart-area fa-3x" style={{ color: theme.subtitleColor, marginBottom: 16 }}></i>
            <div style={{ color: theme.titleColor }}>Sem dados de transações recentes</div>
          </div>
        )}
      </div>
    </div>
  );
}