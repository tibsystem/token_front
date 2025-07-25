// /components/AddBalanceDrawer/PaymentMethodOption.js

import React from "react";
import { FiCheck } from "react-icons/fi";

export default function PaymentMethodOption({ method, isSelected, onSelect, theme }) {
  const IconComponent = method.icon;
  
  return (
    <div
      className="p-4"
      style={{
        border: `2px solid ${isSelected ? "#007bff" : theme.borderColor}`,
        borderRadius: "16px",
        backgroundColor: isSelected ? "rgba(0, 123, 255, 0.05)" : theme.bg,
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: isSelected ? "scale(1.02)" : "scale(1)"
      }}
      onClick={() => onSelect(method.value)}
    >
      <div className="d-flex align-items-center">
        <div className="d-flex justify-content-center align-items-center me-3" style={{ width: "48px", height: "48px", backgroundColor: isSelected ? "#007bff" : theme.iconBg, color: isSelected ? "white" : theme.iconColor, borderRadius: "12px", transition: "all 0.3s" }}>
          <IconComponent size={20} />
        </div>
        <div className="flex-grow-1">
          <div style={{ fontWeight: 600, color: theme.textColor, fontSize: "16px" }}>{method.label}</div>
          <div style={{ color: theme.secondaryTextColor, fontSize: "14px", marginTop: "2px" }}>{method.description}</div>
        </div>
        <div className="rounded-circle" style={{ width: "24px", height: "24px", border: `2px solid ${isSelected ? "#007bff" : theme.borderColor}`, backgroundColor: isSelected ? "#007bff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
          {isSelected && <FiCheck size={14} color="white" />}
        </div>
      </div>
    </div>
  );
}