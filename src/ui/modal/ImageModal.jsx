import React, { useEffect } from 'react';

import './ImageModal.css'

const ImageModal = ({ isOpen = false, onClose, imageURL = null, children }) => {
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
        <div className={`image-modal ${isOpen ? 'open' : ''}`}>
            <div className='image-modal-bg' onClick={onClose}></div>
            <span className="image-modal-close" onClick={onClose}>
                <i className="ri-close-line"></i>
            </span>
            <div className="image-content-container">
                {children}
            </div>
        </div>
    );
};

export default ImageModal;