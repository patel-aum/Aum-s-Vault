import express from 'express';
import { auth } from '../middleware/auth.js';
import { getCards, createCard, updateCard } from '../controllers/cards.js';

const router = express.Router();

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.put('/:id', auth, updateCard);

export default router;