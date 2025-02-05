const querystring = require("querystring");
const axios = require("axios");
const { SECRET_KEY } = require("../utils/constant");
const { saveGoogleUser } = require("../services/auth");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token with Google OAuth2
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    // Extract the user payload from the response
    const googlePayload = response.data;
    const userData = {
      sub: googlePayload.sub,
      name: googlePayload.name,
      given_name: googlePayload.given_name,
      family_name: googlePayload.family_name,
      picture: googlePayload.picture,
      email: googlePayload.email,
      email_verified: googlePayload.email_verified,
    };

    // Save the user data to your database (e.g., MongoDB)
    const user = await saveGoogleUser(userData);

    // Generate a JWT token for the logged-in user
    const jwtToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "5d", // Token expiry time set to 5 days
    });

    // Respond with the JWT token
    res.status(200).json({ message: "Login successful", token: jwtToken });
  } catch (error) {
    console.error("Google login verification failed:", error.message);
    res
      .status(400)
      .json({ message: "Google login failed", error: error.message });
  }
};

module.exports = {
  googleLogin,
};
