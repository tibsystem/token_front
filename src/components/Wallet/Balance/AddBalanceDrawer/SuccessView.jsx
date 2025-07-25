import React from "react";
import { FiCheck } from "react-icons/fi";

export default function SuccessView({ theme }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ minHeight: '300px' }}>
      <div className="rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px", backgroundColor: "#28a745", color: "white" }}>
        <FiCheck size={40} />
      </div>
      <h4 className="mb-3" style={{ color: theme.textColor }}>Saldo Adicionado!</h4>
      <p style={{ color: theme.secondaryTextColor, fontSize: "16px" }}>Seu saldo foi adicionado com sucesso.</p>
    </div>
  );
}