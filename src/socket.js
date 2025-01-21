const { Server } = require("socket.io");
const socketAuthMiddleware = require("./middleware/authSocketMiddleware");
const { generatePeerId }  = require('./utils/function')

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

  let availableForMatch = [];  // Array to store users who are available for match
  let liveUsers = {};  // Object to track live users by socket ID

  // Define connection behavior
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.userId);

    liveUsers[socket.user.userId] = socket.id;
    console.log(`Live users: ${JSON.stringify(liveUsers)}`);
    // Listen for "match" event where user signals availability
    socket.on("match", () => {
        if (liveUsers[socket.user.userId]) {
        if (!availableForMatch.includes(socket.user.userId)) {
            availableForMatch.push(socket.user.userId);
            console.log(`User ${socket.user.userId} is now available for match.`);
        }

        availableForMatch = matchUsers(availableForMatch, liveUsers, io);

  
        } else {
            console.log(`User ${socket.user.userId} is not live, cannot match.`);
        }
     
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.userId);

      // Remove user from the liveUsers and availableForMatch lists if they disconnect
      delete liveUsers[socket.user.userId];
      availableForMatch = availableForMatch.filter((id) => id !== socket.user.userId);

      console.log(`User ${socket.user.userId} removed from live and available lists.`);
    });

    function matchUsers(availableForMatch, liveUsers, io) {
        if (availableForMatch.length >= 2) {
          const user1 = availableForMatch[0]; // Assume user1 is the first user in the list
      
          // Get a random index, ensuring it's not the same as user1
          let randomIndex = Math.floor(Math.random() * availableForMatch.length);
          while (availableForMatch[randomIndex] === user1) {
            randomIndex = Math.floor(Math.random() * availableForMatch.length);
          }
      
          const user2 = availableForMatch[randomIndex]; // Randomly selected user
      
          // Remove the matched users from the available-for-match list
          availableForMatch = availableForMatch.filter((userId) => userId !== user1 && userId !== user2);

          const commonId = generatePeerId();
      
          // Emit the matched event to both users
          io.to(liveUsers[user1]).emit("matched", { matchedWith: user2, commonId });
          io.to(liveUsers[user2]).emit("matched", { matchedWith: user1, commonId });
      
          console.log(`Matched User ${user1} with User ${user2}`);
        } else {
          console.log("Not enough users available for match yet.");
        }
      
        return availableForMatch;  // Return the updated list of available users
      }
      
      
  });


  console.log("Socket.IO initialized");
};

module.exports = initSocket;
