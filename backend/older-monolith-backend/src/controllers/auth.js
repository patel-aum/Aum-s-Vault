import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { query } from '../config/db.js';

// Helper function to generate account number
const generateAccountNumber = () => {
  return '2024' + Math.random().toString().slice(2, 10);
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start transaction
    await query('BEGIN');

    try {
      // Create user
      const userResult = await query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, hashedPassword]
      );

      const user = userResult.rows[0];

      // Create savings account
      const savingsAccountNumber = generateAccountNumber();
      await query(
        'INSERT INTO accounts (user_id, account_number, type, balance) VALUES ($1, $2, $3, $4)',
        [user.id, savingsAccountNumber, 'savings', 0]
      );

      // Create a card for the user
      const cardNumber = '4532 **** **** ' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const cardType = 'credit';  // You can customize or change the card type logic
      const expiryDate = '12/25'; // Replace with a real expiry date if necessary
      const cvv = Math.floor(100 + Math.random() * 900);  // Random CVV for demonstration

      // Insert card information into the cards table
      await query(
        'INSERT INTO cards (user_id, card_number, card_type, expiry_date, cvv) VALUES ($1, $2, $3, $4, $5)',
        [user.id, cardNumber, cardType, expiryDate, cvv]
      );

      // Commit transaction
      await query('COMMIT');

      // Create token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if user exists and get their account information
    const result = await query(
      `SELECT u.*, 
        json_agg(
          json_build_object(
            'id', a.id,
            'account_number', a.account_number,
            'type', a.type,
            'balance', a.balance
          )
        ) as accounts,
        json_agg(
          json_build_object(
            'id', c.id,
            'card_number', c.card_number,
            'card_type', c.card_type,
            'expiry_date', c.expiry_date,
            'cvv', c.cvv
          )
        ) as cards
       FROM users u 
       LEFT JOIN accounts a ON u.id = a.user_id
       LEFT JOIN cards c ON u.id = c.user_id
       WHERE u.email = $1 
       GROUP BY u.id`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accounts: user.accounts,
        cards: user.cards  // Returning the associated cards as well
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
