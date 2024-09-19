import express from 'express';
import { allUsers, getUtentiByEmail, getUserById, postUser, updateUtente, deleteUtente } from '../controllers/utente.js';
const router = express.Router();

router.get('/', async (req, res) => {
    if (Object.keys(req.query).length > 0) {
      await getUtentiByEmail(req, res);
    } else {
      await allUsers(req, res);
    }
  
});
router.get('/:id', getUserById)
router.post('/', postUser);
router.patch('/:id', updateUtente);
router.delete('/:id', deleteUtente)

export default router;
