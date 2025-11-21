const express = require("express");
const router = express.Router();
const { sendWebNotification } = require("../controllers/notificationController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.post("/notify", sendWebNotification);

module.exports = router;