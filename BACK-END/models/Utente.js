import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Utente = sequelize.define('Utente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cognome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
},{  tableName: 'utenti', timestamps: true,});

export default Utente;
