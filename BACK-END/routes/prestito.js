import express from 'express';
import { allLoans, getLoanByEmail, getAvailableBooks, getLoanById, postLoan, updateLoan, deleteLoan } from '../controllers/Prestito.js';
const router = express.Router();

router.get('/getAvailableBooks', getAvailableBooks)
router.get('/', async (req, res) => {
    if (Object.keys(req.query).length > 0) {
      await getLoanByEmail(req, res);
    } else {
      await allLoans(req, res);
    }
  
});
router.get('/:id', getLoanById)
router.post('/', postLoan);
router.patch('/:id', updateLoan);
router.delete('/:id', deleteLoan)

export default router;