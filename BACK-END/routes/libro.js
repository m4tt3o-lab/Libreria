import express from 'express';
import { allBooks, postBook, getLibroById, getLibriByFilter, deleteLibro, updateLibro } from '../controllers/libro.js';

const router = express.Router();

router.get('/', async (req, res) => {
  // parametro di query > di 0 riconosce che è un filtro mentre se è = 0 fa partire normalmente la richiesta per tutti i libri  
      if (Object.keys(req.query).length > 0) {
        await getLibriByFilter(req, res);
      } else {
        await allBooks(req, res);
      }
    
  });
router.get('/:id', getLibroById)
router.post('/', postBook);
router.patch('/:id', updateLibro);
router.delete('/:id', deleteLibro)

export default router;