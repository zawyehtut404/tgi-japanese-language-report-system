import React from 'react';
import './Modal.css';

function Modal({ isOpen, title, message, type, onClose, actions }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-box modal-${type}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          {actions && actions.length > 0 ? (
            actions.map((action, idx) => (
              <button
                key={idx}
                className={`modal-btn modal-btn-${action.type || 'primary'}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button className="modal-btn modal-btn-primary" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
