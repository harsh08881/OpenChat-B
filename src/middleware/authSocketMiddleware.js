const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../utils/constant')

/**
 * Middleware to authenticate a Socket.IO connection
 */
const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token; // Token from client during handshake
  console.log(token)

  if (!token) {
    return next(new Error("Unauthorized: Token not provided"));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded user data to the socket object
    socket.user = decoded;
    console.log(decoded);

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);

    // Send an error event to the client before rejecting
    socket.emit("token_expired", { message: "Token has expired or is invalid" });

    return next(new Error("Forbidden: Invalid token"));
  }
};

module.exports = socketAuthMiddleware;
