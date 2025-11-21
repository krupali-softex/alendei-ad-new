const express = require("express");
const {
  facebookLogin,
  facebookCallback,
  disconnectPage,
} = require("../controllers/fbloginController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Facebook login route (redirect to Facebook for authentication)
router.get("/fblogin", facebookLogin);

// Facebook callback route (handle the response after login)
router.get("/callback", authenticateToken, facebookCallback);

// DELETE /api/linked-accounts/:pageId
router.delete("/linked-accounts/:pageId", authenticateToken, disconnectPage);

module.exports = router;
