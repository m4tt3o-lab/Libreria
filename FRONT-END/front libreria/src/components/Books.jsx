import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style/main.css';
import _ from 'lodash';
import BooksModal from "../ModalBook/BooksModal.jsx";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchBook, setSearchBook] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);


  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const url = 'http://localhost:3000/books';
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Errore durante il recupero dei libri:', error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books?titolo=${searchBook}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    if (searchBook) {
      fetchBooks();
    } else {
      getBooks();
    }
  }, [searchBook]);

  const handleSaveBook = () => {
    setShowAddModal(false);
    getBooks(); 
  };

  const handleSaveEdit = () => {
    setShowEditModal(false);
    getBooks();
  };

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  
  const handleOpenEditModal = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };
  
  const handleCloseEditModal = () => setShowEditModal(false);
  
  const removeBook = async (id) => {
    const url = `http://localhost:3000/books/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.id !== id)
        );
      } else {
        console.error('Errore durante la cancellazione del libro.');
        alert('impossibile eliminare un libro in prestito ad un utente')
      }
    } catch (error) {
      console.error('Errore durante la richiesta di cancellazione del libro:', error);
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span style={{ fontSize: '34px', marginRight:'22px', fontStyle:'oblique' }}><b>Libri <i className="bi bi-book"></i></b></span>
          <button className="btn btn-dark d-flex align-items-center ms-5" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-circle" style={{marginRight: '6px'}}></i>
            Aggiungi Libro
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent ">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
              <li className="nav-item">
              <Link className="nav-link active" to="/Loans">Prestiti</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/Users">Utenti</Link>
              </li>
            </ul>
            <i className="bi bi-search fs-5 me-2 "></i>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="text"
                value={searchBook}
                onChange={(e) => setSearchBook(e.target.value)}
                placeholder="Cerca titolo..."
                aria-label="Search"
              />
            </form>
          </div>
        </div>
      </nav>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Data</th>
            <th>Genere</th>
            <th className="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.titolo}</td>
              <td>{book.autore}</td>
              <td>{new Date(book.annoPubblicazione).toISOString().split('T')[0]}</td>
              <td>{book.genere}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success me-2" onClick={() => handleOpenEditModal(book)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn-danger" onClick={() => removeBook(book.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BooksModal
        showModal={showAddModal || showEditModal}
        onClose={showEditModal ? handleCloseEditModal : handleCloseAddModal}
        onSave={showEditModal ? handleSaveEdit : handleSaveBook}
        actionType={showEditModal ? 'edit' : 'add'}
        book={selectedBook}
      />
    </div>
  );
}

export default Books;
