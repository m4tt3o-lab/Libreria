import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style/main.css';
import { Link } from "react-router-dom";
import UsersModal from "../ModalUser/UsersModal.jsx";
import ConfirmDeleteUserModal from "../ModalUser/UserDeleteModal.jsx";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setsearchEmail] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [UserToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');
 
  useEffect(() => {
    getUsers();
  }, []);
  
  const getUsers = async () => {
    try {
      const url = 'http://localhost:3000/users';
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Errore durante il recupero degli utenti:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users?email=${searchEmail}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchEmail) {
      fetchUsers();
    } else {
      getUsers();
    }
  }, [searchEmail]);

  const handleSaveUser = () => {
    setShowAddModal(false);
    getUsers(); 
  };

  const handleSaveEdit = () => {
    setShowEditModal(false);
    getUsers(); 
  };

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);
  
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const removeUser = async (id) => {
    const url = `http://localhost:3000/users/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setError('');
        handleCloseDeleteModal();
      } else {
        setError('impossibile eliminare un utente che ha un prestito ancora attivo');
        setTimeout(()=>{
          setError('')
        },2000)
      }
    } catch (error) {
      console.error('Errore durante la richiesta di cancellazione del utente:', error);
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span style={{ fontSize: '34px', marginRight: '22px', fontStyle: 'oblique' }}>
            <b>Utenti <i className="bi bi-people"></i></b>
          </span>
          <button className="btn btn-dark d-flex align-items-center ms-5" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-circle" style={{ marginRight: '6px' }}></i>
            Aggiungi Utente
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
              <li className="nav-item">
                <Link className="nav-link active" to="/Loans">Prestiti</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/Books">Libri</Link>
              </li>
            </ul>
            <i className="bi bi-search fs-5 me-2"></i>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type='text'
                value={searchEmail}
                onChange={(e) => setsearchEmail(e.target.value)}
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
            <th>Nome</th>
            <th>Cognome</th>
            <th>Email</th>
            <th className="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.cognome}</td>
              <td>{user.email}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <button className="btn btn-success me-2" onClick={() => handleOpenEditModal(user)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="btn btn-danger" onClick={() => handleOpenDeleteModal(user)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteUserModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={() => removeUser(UserToDelete.id)}
        itemName={UserToDelete ? UserToDelete.email : ''}
        error={error}
      />

      <UsersModal
        showModal={showAddModal || showEditModal}
        onClose={showEditModal ? handleCloseEditModal : handleCloseAddModal}
        onSave={showEditModal ? handleSaveEdit : handleSaveUser}
        actionType={showEditModal ? 'edit' : 'add'}
        user={selectedUser}
      />
    </div>
  );
}

export default Users;
