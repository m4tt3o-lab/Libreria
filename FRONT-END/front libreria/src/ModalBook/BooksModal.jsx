import React from 'react';
import BookEditForm from './BookEditForm.jsx';
import BookPostForm from './BookPostForm.jsx';

const BooksModal = ({ showModal, onClose, onSave, actionType, book }) => {
  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{actionType === 'edit' ? 'Modifica Libro' : 'Aggiungi Libro'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {actionType === 'edit' ? (<BookEditForm book={book} onSave={onSave} />) : (<BookPostForm onSave={onSave} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksModal;
