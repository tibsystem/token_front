import React from "react";

const ConfirmModal = ({ show, title = "Confirmação", message = "Tem certeza que deseja continuar?", icon, onConfirm, onCancel, confirmText = "Sim", cancelText = "Não" }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block custom-modal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header" style={{ borderBottom: "none" }}>
            <h5 className="modal-title" style={{ fontWeight: 700 }}>{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body d-flex align-items-center gap-3" style={{ fontSize: "1.1rem" }}>
            {icon || <span style={{ fontSize: 28, color: "#17c1e8" }}><i className="pi pi-exclamation-triangle" /></span>}
            <span>{message}</span>
          </div>
          <div className="modal-footer justify-content-center" style={{ borderTop: "none" }}>
            <button type="button" className="btn btn-link text-danger fw-bold" onClick={onCancel}>{cancelText}</button>
            <button type="button" className="btn btn-info fw-bold px-4" style={{ boxShadow: "0 0 0 3px #aef1ff" }} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
