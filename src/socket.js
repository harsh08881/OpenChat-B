const { Server } = require("socket.io");
const socketAuthMiddleware = require("./middleware/authSocketMiddleware");
const { generatePeerId }  = require('./utils/function')

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend URL
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


    socket.emit("liveUserCount", Object.keys(liveUsers).length);

    // Listen for "match" event where user signals availability

   // Modify the event to save both Peer ID and user ID
    socket.on("match", (peerId) => { 
    console.log("match")
  // Check if the user is live
     if (liveUsers[socket.user.userId]) {
      // Store both Peer ID and user ID in the availableForMatch array
      const userMatchData = {
          userId: socket.user.userId,  // Save the user's ID
          peerId: peerId               // Save the Peer ID provided by the user
      };

      // Check if the Peer ID is already in the availableForMatch list
      if (!availableForMatch.some(user => user.userId === userId)) {
          availableForMatch.push(userMatchData);
          console.log(`User ${socket.user.userId} with Peer ID ${peerId} is now available for match.`);
      } else {
          console.log(`User with Peer ID ${peerId} is already available for match.`);
      }

      console.log(availableForMatch)

      // Call the function to check and match users
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
      console.log(liveUsers)
    });
    function matchUsers(availableForMatch, liveUsers, io) {
      if (availableForMatch.length >= 2) {
          // Assume user1 is the first user in the list
          const user1 = availableForMatch[0];
          
          // Get the Peer ID for user1
          const user1PeerId = user1.peerId; // Assuming peerId is stored in the user object
  
          // Get a random index, ensuring it's not the same as user1
          let randomIndex = Math.floor(Math.random() * availableForMatch.length);
          while (availableForMatch[randomIndex] === user1) {
              randomIndex = Math.floor(Math.random() * availableForMatch.length);
          }
  
          const user2 = availableForMatch[randomIndex]; // Randomly selected user
  
          // Get the Peer ID for user2
          const user2PeerId = user2.peerId; // Assuming peerId is stored in the user object
  
          // Remove the matched users from the available-for-match list
          availableForMatch = availableForMatch.filter((user) => user !== user1 && user !== user2);
  
          // Emit match event to both users with their Peer IDs
          io.to(liveUsers[user1.userId].socketId).emit("matched", { isInitiator: true, commonId: user1PeerId, matchedWith: user2PeerId });
          io.to(liveUsers[user2.userId].socketId).emit("matched", { isInitiator: false, commonId: user2PeerId, matchedWith: user1PeerId });
  
          console.log(`Matched User ${user1.userId} with User ${user2.userId} using Peer IDs ${user1PeerId} and ${user2PeerId}`);
      } else {
          console.log("Not enough users available for match yet.");
      }
  
      return availableForMatch; // Return the updated list of available users
  }
     
  });


  console.log("Socket.IO initialized");
};

module.exports = initSocket;
