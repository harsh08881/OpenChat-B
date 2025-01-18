const express = require('express');
const axios = require('axios');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const app = express();

// Session setup
app.use(session({
  secret: 'your_secret_key', // Session encryption key
  resave: false,
  saveUninitialized: true
}));

app.use(express.json()); 

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,  // Enable credentials (cookies, HTTP authentication)
  }));
  

// Google OAuth Strategy setup
passport.use(new GoogleStrategy({
  clientID: '256395872874-7f460egvfdrph8re8rr6udej0rkeolh8.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Store user info in session
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);  // Save the user's info in session
});

passport.deserializeUser((user, done) => {
  done(null, user);  // Retrieve the user info from session
});

// Route to initiate Google login
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route to handle response from Google
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  // On success, user info is saved in the session
  res.redirect('/profile');
});

// Profile route to return user info
app.get('/profile', (req, res) => {
  // Check if user is logged in (session exists)
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user); // User data is available in req.user
});

// Route to verify Google ID token using Axios
app.post('/verify-token', async (req, res) => {
  const { token } = req.body;  // Assume the token is passed in the request body

  try {
    // Call Google's OAuth tokeninfo endpoint to verify the token
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const userData = response.data;  // This contains the user's info

    console.log('Verified user data:', userData);

    // Send the user data back to the client
    res.json(userData);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Error verifying token' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
