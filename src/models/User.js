const mongoose = require('mongoose');

// Define the schema for the Google Sign-In data
const UserSchema = new mongoose.Schema({
  sub: {
    type: String,
    required: true,
    unique: true // Ensure no duplicate entries for the same Google user
  },
  name: {
    type: String,
    required: true
  },
  given_name: {
    type: String,
    required: true
  },
  family_name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure no duplicate emails
  },
  email_verified: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model
const User = mongoose.model('User', UserSchema);

module.exports = User;
