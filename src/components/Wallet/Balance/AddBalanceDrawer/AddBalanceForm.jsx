
import React from "react";
import { FiLoader } from "react-icons/fi";
import PaymentMethodOption from "./PaymentMethodOption";

export default function AddBalanceForm({
  amount,
  handleAmountChange,
  errors,
  paymentMethod,
  setPaymentMethod,
  paymentMethods,
  handleSubmit,
  isLoading,
  theme,
}) {
  return (
    <>
      <div className="mb-4">
        <label className="form-label mb-3" style={{ fontWeight: 500, color: theme.textColor }}>Valor</label>
        <input
          type="text"
          className="form-control"
          placeholder="R$ 0,00"
          value={amount}
          onChange={handleAmountChange}
          style={{ backgroundColor: theme.bg, color: theme.textColor, padding: "16px 20px", fontSize: "18px", borderRadius: "16px", border: `2px solid ${errors.amount ? "#dc3545" : theme.borderColor}` }}
        />
        {errors.amount && <div className="mt-2" style={{ color: "#dc3545", fontSize: "14px" }}>{errors.amount}</div>}
        <small style={{ color: theme.secondaryTextColor }} className="mt-2 d-block">Valor mínimo: R$ 1,00</small>
      </div>

      <div className="mb-4">
        <label className="form-label mb-3" style={{ fontWeight: 500, color: theme.textColor }}>Método de Pagamento</label>
        <div className="d-flex flex-column" style={{ gap: "12px" }}>
          {paymentMethods.map((method) => (
            <PaymentMethodOption
              key={method.value}
              method={method}
              isSelected={paymentMethod === method.value}
              onSelect={setPaymentMethod}
              theme={theme}
            />
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={isLoading} className="btn w-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: theme.bgBtn, color: theme.text, border: "none", padding: "16px", borderRadius: "16px", fontWeight: 600, fontSize: "16px", opacity: isLoading ? 0.8 : 1 }}>
        {isLoading ? (
          <>
            <FiLoader className="me-2" style={{ animation: "spin 1s linear infinite" }} />
            Processando...
          </>
        ) : (
          "Confirmar Adição"
        )}
      </button>
    </>
  );
}