import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ fontSize: '4rem', color: '#343a40' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#6c757d' }}>Pagina non trovata <i class="bi bi-emoji-frown"></i></h2>
      
      <p style={{ fontSize: '1.25rem', color: '#495057' }}>
        La pagina che stai cercando non esiste. Torna alla 
        <Link to="/" style={{ color: '#007bff' }}> homepage</Link>.
      </p>
    </div>
  );
};

export default NotFound;