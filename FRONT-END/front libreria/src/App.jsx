import Books from './components/Books.jsx'
import Users from './components/Users.jsx';
import Loans from './components/Loans.jsx';
import NotFound from './components/NotFoundPage.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


function App() {
  return (
    <Router>
        <Routes>
          <Route path='/Books' element={<Books/>} /> 
          <Route path='/Users' element={<Users/>} />
          <Route path='/Loans' element={<Loans/>} />
          <Route path='/' element={<Navigate to="/Books"/>}/> 
          <Route path="*" element={<NotFound />} /> 
        </Routes>
    </Router>
      
    
  );
}

export default App
