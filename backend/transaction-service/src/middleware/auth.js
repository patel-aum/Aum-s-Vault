import axios from 'axios';

export const auth = async (req, res, next) => {
  try {
    // Log all incoming headers to check if 'Authorization' is present
    console.log("Request headers:", req.headers);

    const authHeader = req.header('Authorization');
    if (!authHeader) {
      // Instead of the static message, print the full error
      return res.status(401).json({ message: 'Authorization header is missing', error: 'Authorization header is required for transaction service' });
    }

    try {
      // Making request to auth-service for token validation
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/validate-token`, {
        headers: {
          'Authorization': authHeader // Pass the original Authorization header
        }
      });

      if (!response.data.isValid) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = response.data.user;
      next();
    } catch (error) {
      // If there is an error in the auth-service response, print the whole error
      if (error.response) {
        // Auth service returned an error, include more details
        console.error("Error from auth service:", error.response.data);
        return res.status(error.response.status).json({
          message: error.response.data.message || 'Authentication failed',
          error: error.response.data
        });
      }
      // For other types of errors, rethrow
      throw error;
    }
  } catch (error) {
    // Log the error stack and message for better debugging
    console.error("Authentication error:", error);
    res.status(500).json({ message: 'Internal server error during authentication', error: error.message });
  }
};
