import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    // Retrieve and validate the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = (req, res, next) => {
  try {
    // Retrieve and validate the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

