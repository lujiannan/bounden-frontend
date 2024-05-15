import React, { useEffect } from 'react';

import './AlertModal.css'

const AlertModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

//   if (!isOpen) return null;

  return (
    <div className={`alert-modal ${isOpen? 'open' : ''}`}>
      <div className="alert-modal-content">
        <span className="alert-modal-close" onClick={onClose}>
            <i className="ri-close-line"></i>
        </span>
        {children}
      </div>
    </div>
  );
};

export default AlertModal;