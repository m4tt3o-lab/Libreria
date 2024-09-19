import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Libro from './Libro.js';
import Utente from './Utente.js';

const Prestito = sequelize.define('Prestito', {
  data_prestito: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_restituzione: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'prestiti',
});

// Relazione prestito - libro (ogni prestito appartiene a un libro )
Prestito.belongsTo(Libro, { 
  foreignKey: {
    name: 'libroId',
    allowNull: false // Il libro è obbligatorio per creare un prestito 
  },
  as: 'libro',
  onDelete: 'RESTRICT',  //  per evitare eliminazione se ci sono prestiti attivi
  onUpdate: 'CASCADE'
});

Libro.hasMany(Prestito, { 
  foreignKey: 'libroId', 
  as: 'prestiti'
});

// Relazione prestito - utente (ogni prestito appartiene a un utente)
Prestito.belongsTo(Utente, { 
  foreignKey: {
    name: 'utenteId',
    allowNull: false // L'utente è obbligatorio per un prestito
  },
  as: 'utente',
  onDelete: 'RESTRICT',  
  onUpdate: 'CASCADE'
});

// Relazione utente - prestito (ogni utente può avere più prestiti)
Utente.hasMany(Prestito, { 
  foreignKey: {
    name: 'utenteId',
    allowNull: false // L'utente è obbligatorio per un prestito
  },
  as: 'prestiti'
});

export default Prestito;
