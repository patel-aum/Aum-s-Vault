import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

export default app;

