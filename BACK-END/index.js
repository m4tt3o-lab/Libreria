import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import booksRoutes from './routes/libro.js';
import usersRoutes from './routes/utente.js';
import loansRoutes from './routes/prestito.js';

// Sincronizza il database con i modelli
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database e tabelle sincronizzati');
  })
  .catch(err => {
    console.error('Errore nella sincronizzazione del database:', err);
  });

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = 3000;

// rotte
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);
app.use('/loans', loansRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
