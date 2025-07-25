// /components/AddBalanceDrawer/PaymentDetails.js

import React from "react";
import { FiCopy, FiDownload, FiFileText } from "react-icons/fi";
import { copyToClipboard } from "./utils";

export default function PaymentDetails({ paymentData, theme }) {
  const handleDownloadBoleto = () => {
    const link = document.createElement('a');
    link.href = paymentData.downloadUrl;
    link.download = 'boleto.pdf';
    link.click();
  };

  return (
    <div className="text-center">
      {paymentData.type === "pix" && (
        <>
          <div className="mx-auto mb-3" style={{ width: "200px", height: "200px", backgroundColor: "white", borderRadius: "16px", padding: "10px", border: `2px solid ${theme.borderColor}` }}>
            <img src={paymentData.qrCodeUrl} alt="QR Code Pix" style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
          </div>
          <p style={{ color: theme.secondaryTextColor, fontSize: "14px" }}>Abra o app do seu banco e escaneie o código</p>
          <h5 style={{ color: theme.textColor, margin: "16px 0" }}>Valor: {paymentData.amount}</h5>
          <div className="p-3 mb-3" style={{ backgroundColor: theme.bg, borderRadius: "12px", border: `1px solid ${theme.borderColor}` }}>
            <small style={{ color: theme.secondaryTextColor, fontSize: "12px" }}>Código Pix Copia e Cola</small>
            <div className="mt-2 p-2" style={{ backgroundColor: theme.cardBg, borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: theme.textColor, wordBreak: "break-all", maxHeight: "60px", overflowY: "auto" }}>
              {paymentData.pixCode}
            </div>
          </div>
          <button className="btn w-100 d-flex justify-content-center align-items-center" onClick={() => copyToClipboard(paymentData.pixCode)} style={{ backgroundColor: theme.bgBtn, color: theme.text, border: "none", padding: "14px", borderRadius: "12px", fontWeight: 600 }}>
            <FiCopy className="me-2" size={18} /> Copiar Código Pix
          </button>
        </>
      )}

      {paymentData.type === "boleto" && (
        <>
          <div className="d-flex justify-content-center align-items-center mx-auto mb-3" style={{ width: "120px", height: "120px", backgroundColor: theme.iconBg, borderRadius: "50%", color: theme.iconColor }}>
            <FiFileText size={48} />
          </div>
          <h5 style={{ color: theme.textColor, marginBottom: "8px" }}>Boleto Gerado</h5>
          <p style={{ color: theme.secondaryTextColor, fontSize: "14px" }}>Valor: {paymentData.value} | Vencimento: {paymentData.dueDate}</p>
          <div className="p-3 my-4" style={{ backgroundColor: theme.bg, borderRadius: "12px", border: `1px solid ${theme.borderColor}` }}>
            <small style={{ color: theme.secondaryTextColor, fontSize: "12px" }}>Código de Barras</small>
            <div className="mt-2 p-2" style={{ backgroundColor: theme.cardBg, borderRadius: "8px", fontSize: "14px", fontFamily: "monospace", color: theme.textColor, wordBreak: "break-all" }}>
              {paymentData.boletoCode}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn flex-grow-1 d-flex justify-content-center align-items-center" onClick={() => copyToClipboard(paymentData.boletoCode)} style={{ backgroundColor: theme.bg, color: theme.textColor, border: `1px solid ${theme.borderColor}`, padding: "14px", borderRadius: "12px", fontWeight: 600 }}>
              <FiCopy className="me-2" size={16} /> Copiar
            </button>
            <button className="btn flex-grow-1 d-flex justify-content-center align-items-center" onClick={handleDownloadBoleto} style={{ backgroundColor: theme.bgBtn, color: theme.text, border: "none", padding: "14px", borderRadius: "12px", fontWeight: 600 }}>
              <FiDownload className="me-2" size={16} /> Baixar PDF
            </button>
          </div>
        </>
      )}

      <div className="p-3 mt-4" style={{ backgroundColor: "rgba(40, 167, 69, 0.1)", borderRadius: "12px", border: "1px solid rgba(40, 167, 69, 0.3)" }}>
        <small style={{ color: "#28a745", fontSize: "12px" }}>✓ Assim que o pagamento for confirmado, seu saldo será adicionado automaticamente</small>
      </div>
    </div>
  );
}