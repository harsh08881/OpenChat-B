const jwt = require("jsonwebtoken");
const { SECRET_KEY } =- require('../utils/constant')

/**
 * Middleware to verify the JWT token in the request headers
 */
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = verifyToken;
