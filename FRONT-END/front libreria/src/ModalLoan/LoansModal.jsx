import React from 'react';
import LoanPostForm from './LoanPostForm.jsx';
import LoanEditForm from './LoanEditForm.jsx';
const LoansModal = ({ showModal, onClose, onSave, actionType, loan }) => {
  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{actionType === 'edit' ? 'Modifica Prestito' : 'Aggiungi Prestito'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {actionType === 'edit' ? (<LoanEditForm loan={loan} onSave={onSave} />) : (<LoanPostForm onSave={onSave} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansModal;
