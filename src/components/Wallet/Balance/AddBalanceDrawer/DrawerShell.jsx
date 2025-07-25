
import React from "react";
import { FiX, FiArrowLeft } from "react-icons/fi";

export default function DrawerShell({
  show,
  onClose,
  theme,
  title,
  subtitle,
  children,
  onBack,
}) {
  return (
    <>
      {show && (
        <div
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1040 }}
          onClick={onClose}
        />
      )}
      <div
        className="position-fixed w-100"
        style={{
          bottom: 0,
          left: 0,
          backgroundColor: theme.cardBg,
          borderRadius: "24px 24px 0 0",
          zIndex: 1050,
          transform: show ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          maxWidth: "100vw",
          maxHeight: "90vh",
          boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="d-flex justify-content-center pt-3 pb-2">
          <div style={{ width: "40px", height: "4px", backgroundColor: theme.borderColor, borderRadius: "2px" }} />
        </div>

        <div className="d-flex justify-content-between align-items-center px-4 pb-3">
          <div className="d-flex align-items-center">
            {onBack && (
              <button className="btn p-2 me-3" onClick={onBack} style={{ backgroundColor: theme.iconBg, border: "none", color: theme.iconColor, borderRadius: "12px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiArrowLeft size={20} />
              </button>
            )}
            <div>
              <h4 className="mb-1" style={{ fontWeight: 600, color: theme.textColor }}>{title}</h4>
              <p className="mb-0" style={{ color: theme.secondaryTextColor, fontSize: "14px" }}>{subtitle}</p>
            </div>
          </div>
          <button className="btn p-2" onClick={onClose} style={{ backgroundColor: theme.iconBg, border: "none", color: theme.iconColor, borderRadius: "12px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiX size={20} />
          </button>
        </div>
        
        <div className="px-4 pb-4" style={{ maxHeight: "calc(90vh - 120px)", overflowY: "auto" }}>
            {children}
        </div>
      </div>
    </>
  );
}