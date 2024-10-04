import React from 'react';


const ConfirmDeleteBookModal = ({ isOpen, onClose, onConfirm, itemName, error }) => {
    return (
      <div className={`modal fade ${isOpen ? 'show' : ''}`} tabIndex="-1" style={{ display: isOpen ? 'block' : 'none' }} aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Conferma Cancellazione</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Sei sicuro di voler eliminare <strong>{itemName}</strong>?</p>
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>Conferma</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default ConfirmDeleteBookModal;
