import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,  
  process.env.DB_USER,  
  process.env.DB_PASS || '',  // pw vuota se non è definita
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log
  }
);

sequelize.authenticate()
  .then(() => console.log('Connesso al database MySQL'))
  .catch(err => console.error('Impossibile connettersi:', err));

export default sequelize;
