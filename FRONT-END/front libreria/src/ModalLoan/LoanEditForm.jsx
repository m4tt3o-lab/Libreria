import { format } from 'date-fns';
import { useState, useEffect } from "react";

function LoanEditForm({ loan, onSave }) {
    const [newDataPrestito, setDataPrestito] = useState('');
    const [newDataRestituzione, setDataRestituzione] = useState('');
    const [libri, setLibri] = useState([]);
    const [utenti, setUtenti] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState('');
    const [selectedUtente, setSelectedUtente] = useState('');
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchLibri = async () => {
            try {
                const response = await fetch("http://localhost:3000/loans/getAvailableBooks");
                let data = await response.json();
    
                // Aggiunta del libro corrente manualmente per aggirare il problema di mancanza del campo precompilato per il titolo del libro
                if (loan && loan.libroId) {
                    const isLibroInList = data.some(libro => libro.id === loan.libroId);
                    if (!isLibroInList) {
                        const libroAttuale = {
                            id: loan.libroId,
                            titolo: loan.libro.titolo 
                        };
                        data = [...data, libroAttuale]; 
                    }
                }
    
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
    }, [loan]);

    useEffect(() => {
        if (loan) {
            setDataPrestito(loan.data_prestito ? format(new Date(loan.data_prestito), 'yyyy-MM-dd') : '');
            setDataRestituzione(loan.data_restituzione ? format(new Date(loan.data_restituzione), 'yyyy-MM-dd') : '');
            setSelectedLibro(loan.libroId ?? '');
            setSelectedUtente(loan.utenteId ?? '');
            setIsCompleted(loan.data_restituzione ? true : false);
        }
    }, [loan]);

    function validateDate(dateString) {
        if (!dateString) {
            return true; 
        }
    
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

    const LoanPatch = async (e) => {
        e.preventDefault();

        if (!validateDate(newDataPrestito) || !validateDate(newDataRestituzione)) {
            setError('Data di prestito o di restituzione non valida. Inserisci una data valida nel formato yyyy-MM-dd.');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        const dataRestituzioneToSend = newDataRestituzione || null;

        const url = `http://localhost:3000/loans/${loan.id}`;
        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data_prestito: newDataPrestito,
                    data_restituzione: dataRestituzioneToSend,
                    libroId: selectedLibro,
                    utenteId: selectedUtente
                }),
            });

            const result = await response.json();  

            if (response.ok) {
                setDataPrestito('');
                setDataRestituzione('');
                setSelectedLibro('');
                setSelectedUtente('');
                setError('');
                onSave();  
            } else {
                console.error("Modifica fallita.", result);
                setError(`Errore: ${result.message || 'Modifica fallita'}`);
            }
        } catch (error) {
            console.error("Errore durante la richiesta di modifica:", error);
            setError("Errore durante la richiesta di modifica.");
        }
    };

    return (
        <form onSubmit={LoanPatch} className="p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "5px" }}>
            <div className="mb-3">
                <label htmlFor="dataPrestito" className="form-label me-2" style={{ color: "#343a40" }}>Data Prestito: </label>
                <input
                    type="date"
                    value={newDataPrestito}
                    onChange={(e) => setDataPrestito(e.target.value)}
                    className='form-control'
                    required
                    disabled={isCompleted} 
                    style={{ borderColor:'black', backgroundColor: "#e9ecef" }}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="dataRestituzione" className="form-label me-2" style={{ color: "#343a40" }}>Data Restituzione: </label>
                <input
                    type="date"
                    value={newDataRestituzione}
                    onChange={(e) => setDataRestituzione(e.target.value || '')}
                    className='form-control'
                    disabled={isCompleted} 
                    style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="libroId" className="form-label me-2" style={{ color: "#343a40" }}>Seleziona Libro</label>
                <select
                    value={selectedLibro}
                    onChange={(e) => setSelectedLibro(e.target.value)}
                    className='form-control'
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
                <label htmlFor="utenteId" className="form-label me-2" style={{ color: "#343a40" }}>Seleziona Utente</label>
                <select
                    value={selectedUtente}
                    onChange={(e) => setSelectedUtente(e.target.value)}
                    className='form-control'
                    style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
                >
                    <option value="">Seleziona un utente</option>
                    {utenti.map(utente => (
                        <option key={utente.id} value={utente.id}>
                            {utente.email}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-dark" style={{ marginRight: "10px" }}>
                    Modifica Prestito
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
    );
}

export default LoanEditForm;
