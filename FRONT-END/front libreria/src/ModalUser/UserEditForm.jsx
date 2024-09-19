import { useState, useEffect } from "react";

function UserEditForm({ user, onSave }) {
    const [newNome, setNome] = useState('');
    const [newCognome, setCognome] = useState('');
    const [newEmail, setEmail] = useState('');
    const [error, setError] = useState(''); 

  useEffect(() => {
    if (user) {
        setNome(user.nome || '');
        setCognome(user.cognome || '');
        setEmail(user.email);
    }
  }, [user]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  const UserPatch = async (e) => {
    e.preventDefault();


    const url = `http://localhost:3000/users/${user.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: capitalizeFirstLetter(newNome),
            cognome: newCognome,
            email: newEmail,
        }),
      });

      if (response.ok) {
        setNome('');
        setCognome('');
        setEmail('');
        onSave();
      } else {
        console.error("Modifica fallita.");
      }
    } catch (error) {
      console.error("Errore durante la richiesta di modifica:", error);
    }
  };

  return (
    <form onSubmit={UserPatch} className="p-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "5px" }}>
    <div className="mb-3">
        <label htmlFor="nome" className="form-label" style={{ color: "#343a40" }}>Nome</label>
        <input
            type="text"
            className="form-control"
            id="nome"
            value={newNome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
    </div>
    <div className="mb-3">
        <label htmlFor="cognome" className="form-label" style={{ color: "#343a40" }}>Cognome</label>
        <input
            type="text"
            className="form-control"
            id="cognome"
            value={newCognome}
            onChange={(e) => setCognome(e.target.value)}
            required
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
    </div>
    <div className="mb-3">
        <label htmlFor="email" className="form-label" style={{ color: "#343a40" }}>Email</label>
        <input
            type="email"
            className="form-control"
            id="email"
            value={newEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: "#6c757d", backgroundColor: "#e9ecef" }}
        />
    </div>
    {error && <p style={{ color: "red" }}>{error}</p>}
    <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-dark" style={{ marginRight: "10px" }}>
            Moifica Utente
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => {
            setNome('');
            setCognome('');
            setEmail('');
        }}>
            Reset
        </button>
    </div>
</form>
)
}


export default UserEditForm;
