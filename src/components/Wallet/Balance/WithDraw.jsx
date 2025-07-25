import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWallet } from "@/services/wallet/getWallet";
import { postWithdrawFunds } from "@/services/wallet/postWithDrawFonds";
import { getUserIdFromToken } from "@/utils/auth";
import useDarkMode from "@/hooks/useDarkMode";

export default function WalletWithdraw() {
  const { isDarkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const lightTheme = {
    bg: "#fff",
    cardBg: "#fff",
    hoverBg: "#f5f7fa",
    textColor: "#212529",
    secondaryTextColor: "#6c757d",
    iconColor: "#333",
    iconBg: "#e9ecef",
    borderColor: "#e9ecef",
    dropdownBg: "#f1f3f5",
    dropdownShadow: "0 4px 8px rgba(0,0,0,0.1)",
    dropdownHoverBg: "#f8f9fa",
    bgBtn: "#1C1C1E",
    text: "#fff",
  };

  const darkTheme = {
    bg: "#1C1C1E",
    cardBg: "#1C1C1E",
    hoverBg: "#2C2C2E",
    textColor: "#f8f9fa",
    secondaryTextColor: "#adb5bd",
    iconColor: "#f8f9fa",
    iconBg: "#3A3A3C",
    borderColor: "#3A3A3C",
    dropdownBg: "#2C2C2E",
    dropdownShadow: "0 4px 8px rgba(0,0,0,0.2)",
    dropdownHoverBg: "#3A3A3C",
    bgBtn: "#fff",
    text: "#1C1C1E",
  };
  const theme = isDarkMode ? darkTheme : lightTheme;

  const userId = getUserIdFromToken();
  const [amount, setAmount] = useState("");

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => getWallet(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ userId, amount }) => postWithdrawFunds(userId, amount),
    onSuccess: () => {
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["wallet", userId] });
      toast.success("Saque realizado com sucesso!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Ocorreu um erro ao processar o saque."
      );
    },
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Por favor, informe um valor de saque válido.");
      return;
    }
    if (Number(amount) > (wallet?.balance ?? 0)) {
      toast.error("Seu saldo disponível é insuficiente.");
      return;
    }
    mutate({ userId, amount: Number(amount) });
  };

  return (
    <div className="w-100">
      <aside
        className="panel-wallet-withdraw"
        style={{
          background: theme.bg,
          color: theme.textColor,
          border: `1px solid ${theme.gridColor}`,
          borderRadius: 24,
          padding: 24,
          minHeight: 400,
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.2)"
            : "0 4px 24px rgba(0,0,0,0.06)",
          marginLeft: 0,
          marginRight: "auto",
        }}
      >
        <div
          className="fw-semibold mb-2"
          style={{ color: theme.lineColor, fontSize: 15, opacity: 0.9 }}
        >
          Seu saldo disponível
        </div>
        <div
          className="fw-bold mb-4 d-flex align-items-center"
          style={{
            fontSize: 32,
            letterSpacing: 1,
            minHeight: 48,
            color: theme.textColor,
          }}
        >
          {isLoading ? (
            <div
              className="placeholder-glow w-75"
              style={{
                height: 36,
                borderRadius: 8,
                background: isDarkMode ? "#23272f" : "#e9ecef",
              }}
            ></div>
          ) : (
            (wallet?.balance ?? 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: wallet?.currency || "BRL",
            })
          )}
        </div>
        <form onSubmit={handleWithdraw} autoComplete="off">
          <div className="row">
            <div className="col-xl-8">
              <label
                htmlFor="withdraw-amount"
                className="form-label mb-1"
                style={{
                  fontSize: 14,
                  color: isDarkMode ? "#adb5bd" : "#6c757d",
                }}
              >
                Valor para saque
              </label>
              <input
                id="withdraw-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Ex: 100,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control mb-3"
                style={{
                  borderRadius: 10,
                  fontSize: 18,
                  fontWeight: 500,
                  background: isDarkMode ? "#23272f" : "#fff",
                  color: theme.textColor,
                  border: `1.5px solid ${theme.gridColor}`,
                }}
                disabled={isPending}
              />
            </div>
            <div className="col-xl-4">
              <button
                type="submit"
                className="btn w-100 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: theme.lineColor,
                  color: theme.text,
                  borderRadius: 10,
                  fontSize: 18,
                  padding: "12px 0",
                  opacity: isPending ? 0.7 : 1,
                  cursor: isPending ? "not-allowed" : "pointer",
                  letterSpacing: 0.5,
                  boxShadow: isPending
                    ? "0 0 0 0.2rem rgba(13,110,253,.25)"
                    : "none",
                  transition: "background 0.2s, opacity 0.2s, box-shadow 0.2s",
                  background: theme.bgBtn,
                }}
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <i
                      className="fa fa-paper-plane me-2"
                      aria-hidden="true"
                    ></i>
                    Confirmar Saque
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}
