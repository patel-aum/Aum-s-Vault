import { query } from '../config/db.js';

export const getBalance = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        json_build_object(
          'total_balance', SUM(balance),
          'accounts', json_agg(
            json_build_object(
              'id', id,
              'account_number', account_number,
              'balance', balance,
              'type', type
            )
          )
        ) as balance_info
      FROM accounts 
      WHERE user_id = $1
      GROUP BY user_id`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({
        total_balance: 0,
        accounts: []
      });
    }

    // Ensure accounts is an array even if null
    const balanceInfo = result.rows[0].balance_info;
    balanceInfo.accounts = balanceInfo.accounts || [];

    res.json(balanceInfo);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getTransactions = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        t.*,
        fa.account_number as from_account_number,
        ta.account_number as to_account_number,
        CASE 
          WHEN fa.user_id = $1 THEN 'debit'
          ELSE 'credit'
        END as type
       FROM transactions t
       LEFT JOIN accounts fa ON t.from_account_id = fa.id
       LEFT JOIN accounts ta ON t.to_account_id = ta.id
       WHERE fa.user_id = $1 OR ta.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deposit = async (req, res) => {
  const { accountId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    await query('BEGIN');

    // Verify account ownership
    const accountCheck = await query(
      'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
      [accountId, req.user.id]
    );

    if (accountCheck.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(403).json({ message: 'Unauthorized account access' });
    }

    // Create deposit transaction
    await query(
      `INSERT INTO transactions 
       (to_account_id, amount, type, status, description)
       VALUES ($1, $2, 'debit', 'completed', 'Cash Deposit')`,
      [accountId, amount]
    );

    // Update account balance
    await query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, accountId]
    );

    await query('COMMIT');

    // Get updated account info
    const updatedAccount = await query(
      'SELECT * FROM accounts WHERE id = $1',
      [accountId]
    );

    res.json(updatedAccount.rows[0]);
  } catch (error) {
    await query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const transfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    await query('BEGIN');

    // Verify account ownership
    const accountCheck = await query(
      'SELECT id, balance FROM accounts WHERE id = $1 AND user_id = $2',
      [fromAccountId, req.user.id]
    );

    if (accountCheck.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(403).json({ message: 'Unauthorized account access' });
    }

    // Check sufficient balance
    if (accountCheck.rows[0].balance < amount) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Create transfer transaction
    await query(
      `INSERT INTO transactions 
       (from_account_id, to_account_id, amount, type, status, description)
       VALUES ($1, $2, $3, 'debit', 'completed', $4)`,
      [fromAccountId, toAccountId, amount, description || 'Transfer']
    );

    // Update account balances
    await query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromAccountId]
    );
    await query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toAccountId]
    );

    await query('COMMIT');

    // Get updated account info
    const updatedAccount = await query(
      'SELECT * FROM accounts WHERE id = $1',
      [fromAccountId]
    );

    res.json(updatedAccount.rows[0]);
  } catch (error) {
    await query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

