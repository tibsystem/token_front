import React from 'react';

const CustomModal = ({ 
  id, 
  title, 
  children, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  confirmVariant = "primary",
  show = false,
  size = "md" 
}) => {
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  if (!show) return null;

  return (
    <div 
      className="modal fade show d-block" 
      id={id} 
      tabIndex="-1" 
      aria-labelledby={`${id}Label`} 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className={`modal-dialog modal-${size}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              className={`btn btn-${confirmVariant}`} 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;