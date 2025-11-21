const jwt = require("jsonwebtoken"); //  the jsonwebtoken library
const SECRET_KEY = process.env.JWT_SECRET; // Load the secret key from environment variables

const generateToken = (payload) =>
  jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" }); // Sign the payload with the secret and 7-day expiry

module.exports = { generateToken }; // Export the function

