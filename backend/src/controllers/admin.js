// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('./config/db.js'); 

// Fetch total users
router.get('/total-users', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) AS total FROM users');
  res.json(result.rows[0]);
});

// Fetch total transactions
router.get('/total-transactions', async (req, res) => {
  const result = await db.query('SELECT SUM(amount) AS total FROM transactions WHERE status = $1', ['completed']);
  res.json(result.rows[0]);
});

// Fetch active cards
router.get('/active-cards', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) AS total FROM cards WHERE status = $1', ['active']);
  res.json(result.rows[0]);
});

// Fetch recent transactions
router.get('/recent-transactions', async (req, res) => {
  const result = await db.query(
    'SELECT id, user_id, type, amount, status, created_at FROM transactions ORDER BY created_at DESC LIMIT 10'
  );
  res.json(result.rows);
});

module.exports = router;
