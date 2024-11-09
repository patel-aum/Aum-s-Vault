import axios from 'axios';

export const auth = async (req, res, next) => {
  try {
    console.log("Request headers:", req.headers);

    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing', error: 'Authorization header is required for transaction service' });
    }

    try {
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`, {
        headers: {
          'Authorization': authHeader 
        }  
      });

      if (!response.data.isValid) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = response.data.user;
      next();
    } catch (error) {
      if (error.response) {
        console.error("Error from auth service:", error.response.data);
        return res.status(error.response.status).json({
          message: error.response.data.message || 'Authentication failed',
          error: error.response.data
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: 'Internal server error during authentication', error: error.message });
  }
};
