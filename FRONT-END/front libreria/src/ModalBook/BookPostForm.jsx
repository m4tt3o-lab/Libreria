import { useState } from "react";


function BookPostForm() {
    const [newTitolo, setTitolo] = useState('');
    const [newAutore, setAutore] = useState('');
    const [newAnnoPubblicazione, setAnnoPubblicazione] = useState('');
    const [newGenere, setGenere] = useState('');
    

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    
const BookPost = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/books";
    try {
        const response = await fetch(url, {
            method: "POST",
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
            window.location.reload();
        } else {
            console.error("Aggiunta fallita.");
        }
    } catch (error) {
        console.error("Errore durante la richiesta di aggiunta:", error);
    }
};

return (
    <form onSubmit={BookPost} className="p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "5px" }}>
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
        <label htmlFor="annoPubblicazione" className="form-label" style={{ color: "#343a40" }}>Anno di Pubblicazione</label>
        <input
            type="date"
            className="form-control"
            id="annoPubblicazione"
            value={newAnnoPubblicazione}
            onChange={(e) => setAnnoPubblicazione(e.target.value)}
            required
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
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
            Aggiungi Libro
        </button>
        <button type="reset" className="btn btn-secondary" onClick={() => {
            setTitolo('');
            setAutore('');
            setAnnoPubblicazione('');
            setGenere('');
        }}>
            Reset
        </button>
    </div>
</form>
)
}

export default BookPostForm;
