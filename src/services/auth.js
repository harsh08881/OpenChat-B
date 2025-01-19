const GoogleUser = require('./../models/User');

async function saveGoogleUser(googleData) {
  try {
    // Check if the user already exists
    let user = await GoogleUser.findOne({ sub: googleData.sub });

    if (!user) {
      // If the user does not exist, create a new record
      user = new GoogleUser(googleData);
      await user.save();
      console.log('User saved successfully:', user);
    } else {
      console.log('User already exists:', user);
    }

    // Return the user details
    return user;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;  // Re-throw error to handle it at the calling function
  }
}

module.exports = {
  saveGoogleUser
}
