const express = require('express');
const axios = require('axios');
require("dotenv").config(); 
const connectDB = require('./config/connectdb')
const cors = require('cors');
const router = require('./src/routes')
const PORT = process.env.PORT || 3002;
const querystring = require('querystring');

const app = express();

app.use(express.json());
app.use(cors()); 

connectDB();

app.use('/', router);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app;