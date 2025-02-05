const User = require("../models/User");

/**
 * Controller to get user profile data
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the verified token

    // Fetch user details from the database
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProfile };