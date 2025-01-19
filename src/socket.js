const { Server } = require("socket.io");
const { ExpressPeerServer } = require('peer');
const socketAuthMiddleware = require('./middleware/authSocketMiddleware');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your client domain for better security
      methods: ["GET", "POST"],
    },
  });

  // Middleware for socket authentication (optional)
  io.use(socketAuthMiddleware);
  
  let waitingUsers = [];

  // Define connection behavior
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user?.id);

    // Add user to the waiting queue
    waitingUsers.push(socket.user?.id);

    // Handle match event when user clicks "Match"
    socket.on("match", () => {
      console.log(`User ${socket.user?.id} clicked match button`);
      matchUser(socket.user?.id);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.id);

      // Remove user from the waiting queue
      waitingUsers = waitingUsers.filter(id => id !== socket.user?.id);

      // Attempt to match remaining users again after a disconnection
      matchUser(socket.user?.id);
    });
  });

  // Function to match users from the queue
  function matchUser(userId) {
    // If there are at least two users in the waiting list, try matching them
    if (waitingUsers.length > 1) {
      const matchedUserId = waitingUsers.shift(); // First user in the list

      // Ensure the matched user is not the same as the current user
      if (matchedUserId !== userId) {
        console.log('Matching users:', userId, matchedUserId);
        
        // Notify both users that they have been matched
        io.to(userId).emit('matchFound', { peerId: matchedUserId });
        io.to(matchedUserId).emit('matchFound', { peerId: userId });
      } else {
        console.log('User did not get matched');
      }
    }
  }

  console.log("Socket.IO initialized");
};

module.exports = initSocket;
