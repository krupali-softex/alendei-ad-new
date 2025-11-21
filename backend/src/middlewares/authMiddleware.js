const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const authenticateToken = (req, res, next) => {
  let token;
  token = req.headers.authorization?.split(" ")[1];

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token && req.query.state) {
    token = req.query.state;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};


const superAdminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isSuperAdmin) {
      return res.status(403).json({ message: "Access denied. SuperAdmin only." });
    }

    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticateToken, superAdminAuth };
