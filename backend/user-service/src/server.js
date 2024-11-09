import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js'; // Import user routes
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});