import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/validate-token`, { token });
    if (response.data.valid) {
      req.user = response.data.user;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Auth service error' });
  }
};

