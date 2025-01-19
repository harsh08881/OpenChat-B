const querystring = require('querystring');
const axios =  require('axios')
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  FRONTEND_URL,
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} = require("../utils/constant");
const { saveGoogleUser } = require('../services/auth');
const { SECRET_KEY } =- require('../utils/constant')
const jwt = require("jsonwebtoken");


const googleAuthController = (req, res) => {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });

  const googleAuthUrl = `${GOOGLE_AUTH_URL}?${params}`;
  res.redirect(googleAuthUrl);
};

const googleCallbackController = async (req, res) => {
    const { code } = req.query;
  
    if (!code) {
      console.error("Authorization code missing");
      return res.redirect("/");
    }
  
    try {
      // Exchange authorization code for access token
      const tokenResponse = await axios.post(
        GOOGLE_TOKEN_URL,
        querystring.stringify({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      const { access_token } = tokenResponse.data;
  
      // Fetch user info using the access token
      const userResponse = await axios.get(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      const userData = userResponse.data;
  
      // Save or update the user in the database
      const user = await saveGoogleUser(userData);
  
      // Generate a JWT token using the user's ID
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1h", // Token expiry time (adjust as needed)
      });
  
      // Redirect to the profile page with the token as a query parameter
      res.redirect(`/profile?token=${token}`);
    } catch (error) {
      console.error("Error during Google OAuth:", error.message);
      res.redirect("/");
    }
  };

module.exports = {
  googleAuthController,
  googleCallbackController,
};
