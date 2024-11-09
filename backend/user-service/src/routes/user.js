import express from 'express';
import { auth } from '../middleware/auth.js';  
import { getProfile, updateProfile, getBeneficiaries } from '../controllers/users.js';

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/beneficiaries', auth, getBeneficiaries);
router.put('/profile', auth, updateProfile);

export default router;

