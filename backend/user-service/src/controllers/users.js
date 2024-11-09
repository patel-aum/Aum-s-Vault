import { query } from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBeneficiaries = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        u.id, 
        u.name, 
        u.email,
        (
          SELECT json_agg(
            json_build_object(
              'id', a.id,
              'account_number', a.account_number,
              'type', a.type
            )
          )
          FROM accounts a 
          WHERE a.user_id = u.id
        ) as accounts
       FROM users u
       WHERE u.id != $1`,
      [req.user.id]
    );

    // Filter out any null accounts and ensure each user has an accounts array
    const beneficiaries = result.rows.map(user => ({
      ...user,
      accounts: user.accounts || []
    }));

    res.json(beneficiaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, name, email, role',
      [name, email, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

