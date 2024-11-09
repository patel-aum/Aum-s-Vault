import { query } from '../config/db.js';

export const getCards = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM cards WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCard = async (req, res) => {
  try {
    const { cardType } = req.body;
    const cardNumber = Math.random().toString().slice(2, 18);
    const cvv = Math.random().toString().slice(2, 5);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4);

    const result = await query(
      `INSERT INTO cards 
       (user_id, card_number, card_type, expiry_date, cvv)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, cardNumber, cardType, expiryDate, cvv]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      `UPDATE cards 
       SET status = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};