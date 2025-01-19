const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your client domain for better security
      methods: ["GET", "POST"],
    },
  });

  // Middleware for socket authentication (optional)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Pass token during connection
    if (!token) {
      return next(new Error("Unauthorized: Token not provided"));
    }
    try {
      // Example: Verify token logic (replace with your token validation)
      socket.user = { id: token }; // Attach user data to socket
      next();
    } catch (err) {
      console.error("Socket authentication failed:", err.message);
      next(new Error("Forbidden: Invalid token"));
    }
  });

  // Define connection behavior
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user?.id);

    // Handle events
    socket.on("message", (data) => {
      console.log(`Message from ${socket.user?.id}:`, data);
      socket.emit("message-received", { status: "ok" });
    });

    // Disconnect handling
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.id);
    });
  });

  console.log("Socket.IO initialized");
};

module.exports = initSocket;
