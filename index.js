const express = require('express');
const axios = require('axios');
require("dotenv").config(); 
const http = require('http'); // Required to bind Socket.IO to the HTTP server
const { ExpressPeerServer } = require('peer'); 
const cors = require('cors');
const connectDB = require('./config/connectdb');
const router = require('./src/routes');
const initSocket = require('./src/socket'); // Import the Socket.IO initialization
const PORT = process.env.PORT || 3002;

const app = express();

const corsOptions = {
  origin: "*", // Replace with your frontend URL (e.g., http://localhost:3000)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,  // Allow credentials (cookies, authentication tokens)
};


// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Database connection
connectDB();

// Routes

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);
app.use('/', router);

peerServer.on('error', (err) => {
  console.error('Peer Server Error:', err);
});





// Initialize Socket.IO
initSocket(server);


module.exports = app;
