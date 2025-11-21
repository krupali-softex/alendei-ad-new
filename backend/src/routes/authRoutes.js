const express = require("express");
const { login, signup, switchWorkspace, getSession, updateUser, logout } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/switch-workspace", authenticateToken, switchWorkspace);
router.post("/session", authenticateToken, getSession);
router.patch("/update-user",authenticateToken, updateUser);
router.post("/logout", authenticateToken, logout);



module.exports = router;

