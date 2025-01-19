const { Server } = require("socket.io");
const socketAuthMiddleware = require('./middleware/authSocketMiddleware')

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your client domain for better security
      methods: ["GET", "POST"],
    },
  });

  // Middleware for socket authentication (optional)
  io.use(socketAuthMiddleware);

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
