import express from 'express';
import { body } from 'express-validator';
import { register, login, validateToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty()
  ],
  register
);

router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  login
);

router.get('/validate-token', validateToken);

export default router;