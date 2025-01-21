const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");
const socketAuthMiddleware = require("./middleware/authSocketMiddleware");
const { generatePeerId } = require('./utils/function')
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware for socket authentication (optional)
  io.use(socketAuthMiddleware);

  let waitingUsers = [];

  // Define connection behavior
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.userId);

    // Add user to the waiting queue
    waitingUsers.push(socket.user.userId);
    console.log(waitingUsers);

    

    // Listen for a specific event to get the active user count
    socket.on("get_waiting_count", () => {
        const count = waitingUsers.length;
        socket.emit("waiting_count", count); // Send the count only to the requesting user
        console.log(`Sent waiting count to ${socket.id}: ${count}`);
      });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.userId);

      // Remove user from the waiting queue
      waitingUsers = waitingUsers.filter((id) => id !== socket.user.userId);
    });
  });

  console.log("Socket.IO initialized");
};

module.exports = initSocket;
