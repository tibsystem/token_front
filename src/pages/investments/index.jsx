import { useState } from "react";
import DataTable from "@/components/table/DataTable";
import Column from "@/components/table/Column";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

//components
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
import CardsInvestments from '@/components/Investments/CardsInvestments';

//utils
import { getUserIdFromToken } from "@/utils/auth";
//hooks
import useDarkMode from "@/hooks/useDarkMode";

import { getInvestments } from "@/services/investments/getInvestments";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function InvestimentosPage() {
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const textClass = isDarkMode ? "text-white" : "text-dark";

  const formatDateToBR = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const userId = getUserIdFromToken();
  const {
    data: transacoes = [],
    isLoading: loading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["investments", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Faça login novamente.");
      const response = await getInvestments(userId);
      if (Array.isArray(response)) return response;
      if (response && typeof response === "object") return [response];
      return [];
    },
    enabled: !!userId,
    retry: 1,
    onError: (err) => {
      setError(err?.message || "Erro ao buscar investimentos");
      toast.error(
        "Erro ao carregar investimentos. Tente novamente mais tarde."
      );
    },
  });

  const totalInvestido = Array.isArray(transacoes)
    ? transacoes.reduce((acc, item) => {
        const valorUnitario = Number(item?.valor_unitario) || 0;
        const qtdTokens = Number(item?.qtd_tokens) || 0;
        return acc + valorUnitario * qtdTokens;
      }, 0)
    : 0;

    const totalTokens = Array.isArray(transacoes)
    ? transacoes.reduce((acc, item) => {
        return acc + (Number(item?.qtd_tokens) || 0);
      }, 0)
    : 0;

  const ticketMedio =
    Array.isArray(transacoes) && transacoes.length > 0 && !isNaN(totalInvestido)
      ? totalInvestido / transacoes.length
      : 0;

  const chartData = {
    options: {
      chart: {
        id: "invest-chart",
        toolbar: { show: false },
        background: "transparent",
      },
      xaxis: {
        categories: Array.isArray(transacoes)
          ? transacoes.map((item) => formatDateToBR(item?.data_compra))
          : [],
        labels: {
          rotate: -45,
          style: {
            fontSize: "12px",
            colors: isDarkMode ? "#adb5bd" : "#6c757d",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? "#adb5bd" : "#6c757d",
          },
        },
      },
      colors: ["#0d6efd"],
      dataLabels: { enabled: false },
      grid: {
        borderColor: isDarkMode ? "#495057" : "#e9ecef",
        row: {
          colors: ["transparent"],
        },
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        y: {
          formatter: (val) =>
            `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        },
      },
      theme: {
        mode: isDarkMode ? "dark" : "light",
      },
    },
    series: [
      {
        name: "Valor Investido",
        data: Array.isArray(transacoes)
          ? transacoes.map((item) => {
              const valorUnitario = Number(item?.valor_unitario) || 0;
              const qtdTokens = Number(item?.qtd_tokens) || 0;
              return valorUnitario * qtdTokens;
            })
          : [],
      },
    ],
  };

  return (
    <div className="container-fluid py-4">
      <BreadCrumb items={[{ label: "Investimentos", path: "/investments" }]} />

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className={`text-2xl mb-2 ${textClass} mt-3 fw-bold`}>
                <i className="fa fa-chart-pie me-3 "></i>
                Meus Investimentos
              </h1>
              <p className="text-muted mb-0">
                Acompanhe a evolução dos seus tokens imobiliários
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {!loading && !error && !isError && (
        <>
          <CardsInvestments
            totalInvestido={totalInvestido}
            totalTokens={totalTokens}
            ticketMedio={ticketMedio}
          />

          <div className="row mb-5">
            <div className="col-lg-12">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h5 className="mb-1 fw-bold text-dark">
                    <i className="fa fa-chart-line me-2 text-dark"></i>
                    Evolução dos Investimentos
                  </h5>
                  <small className="text-muted">
                    Histórico de compras de tokens por período
                  </small>
                </div>
              </div>
              <div
                className={`mb-3${
                  isDarkMode ? " datatable-dark-mode" : "datatable-light-mode"
                }`}
              >
                <div
                  className={`chart-container${isDarkMode ? "-dark-mode" : ""}`}
                  style={{ minHeight: 320 }}
                >
                  {typeof window !== "undefined" && transacoes.length > 0 ? (
                    <ApexChart
                      key={`chart-${isDarkMode ? "dark" : "light"}`}
                      options={chartData.options}
                      series={chartData.series}
                      type="bar"
                      height={320}
                    />
                  ) : (
                    <div className="empty-state text-center">
                      <i className="fa fa-chart-line fa-3x text-muted"></i>
                      <h6 className="text-muted">Nenhum dado para exibir</h6>
                      <p className="text-muted">
                        Faça seu primeiro investimento para ver o gráfico
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card-header  border-bottom-0 d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 fw-bold text-dark">
                    <i className="fa fa-list me-2 text-dark"></i>
                    Histórico de Compras
                  </h5>
                  <small className="text-muted">
                    Detalhamento de todas as suas aquisições de tokens
                  </small>
                </div>
              </div>
              <div
                className="card-body p-0"
                style={{ boxShadow: "none", border: "none", padding: 0 }}
              >
                <DataTable
  value={Array.isArray(transacoes) ? transacoes : []}
                  loading={loading}
                  emptyMessage={
                    <div className=" text-center">
                      <i className="fa fa-inbox fa-3x text-muted"></i>
                      <h6 className="text-muted">
                        Nenhum investimento encontrado
                      </h6>
                      <p className="text-muted">
                        Comece a investir em tokens imobiliários agora
                      </p>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-dark btn-lg px-4"
                          onClick={() => (window.location.href = "/properties")}
                        >
                          <i className="fa fa-plus me-2"></i>
                          <span>Fazer Primeiro Investimento</span>
                        </button>
                      </div>
                    </div>
                  }
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  striped
                  hover
                  responsive
                  globalFilter
                  className="investment-table"
                >
                  <Column
                    field="id"
                    header="#ID"
                    sortable
                    body={(row) => (
                      <span className="fw-bold text-primary">
                        #{row.id || "-"}
                      </span>
                    )}
                    style={{ minWidth: 80 }}
                  />
                  <Column
                    field="title"
                    header="Propriedade"
                    sortable
                    body={(row) => (
                      <div className="d-flex align-items-center">
                        <div className="property-icon bg-primary bg-opacity-10 me-3">
                          <i className="fa fa-building text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">
                            Propriedade: {row.title || "-"}
                          </div>
                          <small className="text-muted">
                            Token Imobiliário
                          </small>
                        </div>
                      </div>
                    )}
                    style={{ minWidth: 200 }}
                  />
                  <Column
                    field="qtd_tokens"
                    header="Tokens"
                    sortable
                    body={(row) => (
                      <span className="badge bg-light text-dark fs-6">
                        {row.qtd_tokens || 0}
                      </span>
                    )}
                    style={{ minWidth: 100 }}
                  />
                  <Column
                    field="valor_unitario"
                    header="Valor Unitário"
                    sortable
                    body={(row) =>
                      `R$ ${Number(row.valor_unitario || 0).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 }
                      )}`
                    }
                    style={{ minWidth: 120 }}
                  />
                  <Column
                    field="total_investido"
                    header="Total Investido"
                    sortable
                    body={(row) =>
                      `R$ ${(
                        Number(row.valor_unitario || 0) *
                        Number(row.qtd_tokens || 0)
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    }
                    style={{ minWidth: 140 }}
                  />
                  <Column
                    field="status"
                    header="Status"
                    sortable
                    body={(row) => (
                      <span
                        className={`badge ${
                          (row.status || "").toLowerCase() === "ativo"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        <i
                          className={`fa ${
                            (row.status || "").toLowerCase() === "ativo"
                              ? "fa-check-circle"
                              : "fa-pause-circle"
                          } me-1`}
                        ></i>
                        {row.status || "N/A"}
                      </span>
                    )}
                    style={{ minWidth: 100 }}
                  />
                  <Column
                    field="origem"
                    header="Origem"
                    sortable
                    body={(row) => (
                      <span className="badge bg-info">
                        {row.origem || "Plataforma"}
                      </span>
                    )}
                    style={{ minWidth: 100 }}
                  />
                  <Column
                    field="data_compra"
                    header="Data"
                    sortable
                    body={(row) => (
                      <span className="text-muted">
                        {formatDateToBR(row.data_compra)}
                      </span>
                    )}
                    style={{ minWidth: 160 }}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </>
      )}
      {isError && (
        <div className="alert alert-danger mt-4" role="alert">
          {queryError?.message || error || "Erro ao carregar investimentos."}
          <button className="btn btn-link" onClick={() => refetch()}>
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}
