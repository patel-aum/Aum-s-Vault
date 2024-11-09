import axios from 'axios';

export const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    // Call the auth-service's validate-token endpoint using the environment variable
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}`, { token });

    if (response.data.valid) {
      req.user = response.data.user;
      next();  // Proceed with the request
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

