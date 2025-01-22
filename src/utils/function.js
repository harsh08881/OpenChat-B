const crypto = require('crypto');

/**
 * Generate a unique peerId in UUID format
 * @returns {string} peerId - A unique peerId string
 */
function generatePeerId() {
  // Generate 16 random bytes
  const randomBytes = crypto.randomBytes(16);

  // Convert the bytes into a UUID format
  const uuid = [
    randomBytes.toString('hex').slice(0, 8),
    randomBytes.toString('hex').slice(8, 12),
    randomBytes.toString('hex').slice(12, 16),
    randomBytes.toString('hex').slice(16, 20),
    randomBytes.toString('hex').slice(20, 32),
  ].join('-');

  return uuid;
}

module.exports = {
  generatePeerId,
};
