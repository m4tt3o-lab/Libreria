import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style/main.css';
import { Link } from "react-router-dom";
import LoansModal from "../ModalLoan/LoansModal.jsx";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [searchLoan, setSearchLoan] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);


    useEffect(() => {
        getLoans();
      }, []);
    
      const getLoans = async () => {
        try {
          const url = 'http://localhost:3000/loans';
          const response = await fetch(url);
          const data = await response.json();
          setLoans(data);
        } catch (error) {
        }
      };
//implementazione API del filtro
      useEffect(() => {
        const fetchLoans = async () => {
          try {
            const response = await fetch(`http://localhost:3000/loans?email=${searchLoan}`);
            const data = await response.json();
            setLoans(data);
          } catch (error) {
          }
        };
    
        if (searchLoan) {
          fetchLoans();
        } else {
          getLoans();
        }
      }, [searchLoan]);

      const handleSaveLoan = () => {
        setShowAddModal(false);
        getLoans(); 
      };
    
      const handleSaveEdit = () => {
        setShowEditModal(false);
        getLoans(); 
      };
    
      const handleOpenAddModal = () => setShowAddModal(true);
      const handleCloseAddModal = () => setShowAddModal(false);
      
      const handleOpenEditModal = (loan) => {
        setSelectedLoan(loan);
        setShowEditModal(true);
      };
      
      const handleCloseEditModal = () => setShowEditModal(false);


      const removeLoan = async (id) => {
        const url = `http://localhost:3000/loans/${id}`;
    
        try {
          const response = await fetch(url, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            setLoans((prevLoans) =>
              prevLoans.filter((loan) => loan.id !== id)
            );
          } else {
            alert('impossibile eliminare un prestito attivo')
          }
        } catch (error) {
          console.error('Errore durante la richiesta di cancellazione del prestito:', error);
        }
      };
    


   
      return (
        <div className="container-fluid p-0 m-0">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <span style={{ fontSize: '34px', marginRight:'22px', fontStyle:'oblique' }}><b>Prestiti <i className="bi bi-arrow-left-right"></i></b></span>
              <button className="btn btn-dark d-flex align-items-center ms-5" onClick={handleOpenAddModal} >
                <i className="bi bi-plus-circle" style={{marginRight: '6px'}}></i>
                Crea Prestito
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent ">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
                  <li className="nav-item">
                  <Link className="nav-link active" to="/Users">Utenti</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/Books">Libri</Link>
                  </li>
                </ul>
                <i className="bi bi-search fs-5 me-2 "></i>
                <form className="d-flex">
              <input
                className="form-control me-2"
                type="text"
                value={searchLoan}
                onChange={(e) => setSearchLoan(e.target.value)}
                placeholder="Cerca e-mail utente..."
                aria-label="Search"
              />
            </form>
              </div>
            </div>
          </nav>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Data prestito</th>
                <th>Data restituzione</th>
                <th>Email utente</th>
                <th>Titolo libro</th>
                <th>Stato prestito</th>
                <th className="text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.data_prestito}</td>
                  <td>{loan.data_restituzione || 'NULL'}</td>
                  <td>{loan.utente.email}</td> 
                  <td>{loan.libro.titolo}</td>
                  <td style={{ color: loan.data_restituzione ? 'green' : 'red' }}>
                      {loan.data_restituzione ? <b>Concluso</b>  : <b>Attivo</b> }
                    </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-success me-2" onClick={() => handleOpenEditModal(loan)} >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-danger" onClick={() => removeLoan(loan.id)} >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        <LoansModal
        showModal={showAddModal || showEditModal}
        onClose={showEditModal ? handleCloseEditModal : handleCloseAddModal}
        onSave={showEditModal ? handleSaveEdit : handleSaveLoan}
        actionType={showEditModal ? 'edit' : 'add'}
        loan={selectedLoan}
      />

        </div>
      );
}

export default Loans;