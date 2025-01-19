
const CLIENT_ID = '256395872874-7f460egvfdrph8re8rr6udej0rkeolh8.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3002/auth/google/callback';
const FRONTEND_URL = 'http://localhost:3000'; // Frontend URL for redirection after login

// Google OAuth URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

module.exports = {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    FRONTEND_URL,
    GOOGLE_AUTH_URL,
    GOOGLE_TOKEN_URL,
    GOOGLE_USERINFO_URL,
  };