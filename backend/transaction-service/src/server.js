import express from 'express';
import bodyParser from 'body-parser';
import transactionRoutes from './routes/transactions.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/transactions', transactionRoutes);

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Transactions service is running on port ${port}`);
});

