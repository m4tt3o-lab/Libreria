import { useState, useEffect } from "react";

function LoanPostForm() {
    const [newDataPrestito, setDataPrestito] = useState('')
    const [newDataRestituzione, setDataRestituzione] = useState('')
    const [libri, setLibri] = useState([])
    const [utenti, setUtenti] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState('');
    const [selectedUtente, setSelectedUtente] = useState('');




useEffect(() => {
    const fetchLibri = async () => {
        try {
            const response = await fetch("http://localhost:3000/loans/getAvailableBooks");
            const data = await response.json();
            setLibri(data);
        } catch (error) {
            console.error("Errore durante il recupero dei libri disponibili:", error);
        }
    };

    const fetchUtenti = async () => {
        try {
            const response = await fetch("http://localhost:3000/users");
            const data = await response.json();
            setUtenti(data);
        } catch (error) {
            console.error("Errore durante il recupero degli utenti:", error);
        }
    };

    fetchLibri();
    fetchUtenti();
}, []);

const LoanPost = async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/loans";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data_prestito: newDataPrestito,
                data_restituzione: newDataRestituzione,
                libroId: selectedLibro,
                utenteId: selectedUtente
            }),
        });
        if (response.ok) {
            setDataPrestito('');
            setDataRestituzione('');
            setSelectedLibro('');
            setSelectedUtente('');
            window.location.reload();
        } else {
            console.error("Aggiunta fallita.");
        }
    } catch (error) {
        console.error("Errore durante la richiesta di aggiunta:", error);
    }
}
return (
    <form onSubmit={LoanPost} className="p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "5px" }}>
    <div className="mb-3">
        <label htmlFor="dataPrestito" className="form-label" style={{ color: "#343a40" }}>Data Prestito:</label>
        <input
            type="date"
            value={newDataPrestito}
            onChange={(e) => setDataPrestito(e.target.value)}
            required
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
    </div>
    <div className="mb-3">
        <label htmlFor="dataRestituzione" className="form-label" style={{ color: "#343a40" }}>Data restituzione</label>
        <input
            type="date"
            value={newDataRestituzione}
            onChange={(e) => setDataPrestito(e.target.value || null)}
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
    </div>
    <div className="mb-3">
        <label htmlFor="libroId" className="form-label" style={{ color: "#343a40" }}>Seleziona Libro</label>
                <select
                    value={selectedLibro}
                    onChange={(e) => setSelectedLibro(e.target.value)}
                    style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
                >
                    <option value="">Seleziona un libro</option>
                    {libri.map(libro => (
                        <option key={libro.id} value={libro.id}>
                            {libro.titolo}
                        </option>
                    ))}
                </select>
    </div>
    <div className="mb-3">
        <label htmlFor="utenteId" className="form-label" style={{ color: "#343a40" }}>Seleziona utente</label>
                 <select
                    value={selectedUtente}
                    onChange={(e) => setSelectedUtente(e.target.value)}
                >
                    <option value="">Seleziona un utente</option>
                    {utenti.map(utente => (
                        <option key={utente.id} value={utente.id}>
                            {utente.email}
                        </option>
                    ))}
                </select>
    </div>
    <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-dark" style={{ marginRight: "10px" }}>
            Aggiungi Prestito
        </button>
        <button type="reset" className="btn btn-secondary" onClick={() => {
            setDataPrestito('');
            setDataRestituzione('');
            setSelectedLibro('');
            setSelectedUtente('');
        }}>
            Reset
        </button>
    </div>
</form>
)
};

export default LoanPostForm;


