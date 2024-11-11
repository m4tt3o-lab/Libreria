import React from 'react';
import UserPostForm from './UserPostForm.jsx';
import UserEditForm from './UserEditForm.jsx';
const UsersModal = ({ showModal, onClose, onSave, actionType, user }) => {
  
  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{actionType === 'edit' ? 'Modifica Utente' : 'Aggiungi Utente'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {actionType === 'edit' ? (<UserEditForm user={user} onSave={onSave} />) : (<UserPostForm onSave={onSave} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;