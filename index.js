const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Session setup
app.use(session({
  secret: 'your_secret_key', // Session encryption key
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

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

// Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  // On success, user info is saved in the session
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  // Check if user is logged in (session exists)
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user); // User data is available in req.user
});

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
