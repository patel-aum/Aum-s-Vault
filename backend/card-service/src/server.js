import express from 'express';
import cardRoutes from './routes/card.js';
import cors from 'cors';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api/cards', cardRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Card Service running on port ${PORT}`);
});

