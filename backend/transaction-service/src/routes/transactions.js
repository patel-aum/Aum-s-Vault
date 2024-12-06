import express from 'express';
import { auth } from '../middleware/auth.js';
import { getTransactions, deposit, transfer, getBalance } from '../controllers/transactions.js';

const router = express.Router();

router.get('/', auth, getTransactions);
router.post('/deposit', auth, deposit);
router.post('/transfer', auth, transfer);
router.get('/balance', auth, getBalance);

export default router;

