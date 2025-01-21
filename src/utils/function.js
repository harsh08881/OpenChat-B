const crypto = require('crypto');

/**
 * Generate a unique peerId using crypto
 * @returns {string} peerId - A unique peerId string
 */
function generatePeerId() {
  // Generate a random 16-byte string and convert it to hex
  const randomBytes = crypto.randomBytes(16).toString('hex');
  
  // Return the peerId with a prefix for clarity
  return `peer-${randomBytes}`;
}

module.exports = {
  generatePeerId,
};
