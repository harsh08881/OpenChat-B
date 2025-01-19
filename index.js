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

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/', router);

// Create HTTP server and bind it to Express
const server = http.createServer(app);


const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',  // Path for PeerJS
});

app.use('/peerjs', peerServer);

// Initialize Socket.IO
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
