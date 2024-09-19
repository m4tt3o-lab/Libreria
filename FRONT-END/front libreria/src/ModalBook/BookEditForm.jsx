import { useState, useEffect } from "react";
import { format } from 'date-fns'; 

function BookEditForm({ book, onSave }) {
  const [newTitolo, setTitolo] = useState('');
  const [newAutore, setAutore] = useState('');
  const [newAnnoPubblicazione, setAnnoPubblicazione] = useState('');
  const [newGenere, setGenere] = useState('');
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (book) {
      setTitolo(book.titolo || '');
      setAutore(book.autore || '');
      setAnnoPubblicazione(book.annoPubblicazione ? format(new Date(book.annoPubblicazione), 'yyyy-MM-dd') : '');
      setGenere(book.genere || '');
    }
  }, [book]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // validazione data
  function validateDate(dateString) {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
      return false;
    }

    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    if (isNaN(year) || year < 0 || year > new Date().getFullYear()) {
      return false;
    }

    if (isNaN(month) || month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate(); 
    if (isNaN(day) || day < 1 || day > daysInMonth) {
      return false;
    }

    return true;
  }

  const BookPatch = async (e) => {
    e.preventDefault();

    if (!validateDate(newAnnoPubblicazione)) {
      setError('Data di pubblicazione non valida. Inserisci una data valida nel formato yyyy-MM-dd.');
      setTimeout(()=> {
        setError('')
      },2000)
      return;
    }

    const url = `http://localhost:3000/books/${book.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titolo: capitalizeFirstLetter(newTitolo),
          autore: capitalizeFirstLetter(newAutore),
          annoPubblicazione: newAnnoPubblicazione,
          genere: newGenere
        }),
      });

      if (response.ok) {
        setTitolo('');
        setAutore('');
        setAnnoPubblicazione('');
        setGenere('');
        setError('');
        onSave();
      } else {
        console.error("Modifica fallita.");
      }
    } catch (error) {
      console.error("Errore durante la richiesta di modifica:", error);
    }
  };

  return (
    <form onSubmit={BookPatch} className="p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "5px" }}>
      <div className="mb-3">
        <label htmlFor="titolo" className="form-label" style={{ color: "#343a40" }}>Titolo</label>
        <input
          type="text"
          className="form-control"
          id="titolo"
          value={newTitolo}
          onChange={(e) => setTitolo(e.target.value)}
          required
          style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="autore" className="form-label" style={{ color: "#343a40" }}>Autore</label>
        <input
          type="text"
          className="form-control"
          id="autore"
          value={newAutore}
          onChange={(e) => setAutore(e.target.value)}
          required
          style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="annoPubblicazione" className="form-label" style={{ color: "#343a40" }}>Data di Pubblicazione</label>
        <input
          type="text"
          className="form-control"
          id="annoPubblicazione"
          value={newAnnoPubblicazione}
          onChange={(e) => setAnnoPubblicazione(e.target.value)}
          required
          style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="genere" className="form-label" style={{ color: "#343a40" }}>Genere</label>
        <input
          type="text"
          className="form-control"
          id="genere"
          value={newGenere}
          onChange={(e) => setGenere(e.target.value)}
          required
          style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-dark" style={{ marginRight: "10px" }}>
          Modifica Libro
        </button>
        <button type="reset" className="btn btn-secondary" onClick={() => {
          setTitolo('');
          setAutore('');
          setAnnoPubblicazione('');
          setGenere('');
          setError('');
        }}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default BookEditForm;
