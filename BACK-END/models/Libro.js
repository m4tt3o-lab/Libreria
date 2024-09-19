import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Libro = sequelize.define('Libro', {
  titolo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autore: {
    type: DataTypes.STRING,
    allowNull: false
  },
  annoPubblicazione: {
    type: DataTypes.DATE,
    allowNull: false
  },
  genere: {
    type: DataTypes.STRING, 
    allowNull: false
  }
},
{  tableName: 'libri', timestamps: true,});

export default Libro;