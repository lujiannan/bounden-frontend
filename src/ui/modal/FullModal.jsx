import React, { useEffect } from 'react';

import './FullModal.css'

const TiptapImageUploadModal = ({ isOpen, onClose, children }) => {
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

  if (!isOpen) return null;

  return (
    <div className="full-modal">
      <div className="full-modal-content">
        <span className="full-modal-close" onClick={onClose}>
            <i className="ri-close-line"></i>
        </span>
        {children}
      </div>
    </div>
  );
};

export default TiptapImageUploadModal;