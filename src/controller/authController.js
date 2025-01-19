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

    console.log("User Data:", userData);

    // Redirect to profile page or save user data as required
    res.redirect("/profile");
  } catch (error) {
    console.error("Error during Google OAuth:", error.message);
    res.redirect("/");
  }
};

module.exports = {
  googleAuthController,
  googleCallbackController,
};
