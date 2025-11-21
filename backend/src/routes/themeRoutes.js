const express = require("express");

const router = express.Router();

const { fetchThemeImages } = require("../controllers/themeController");

router.get("/themes/:businessCategory", fetchThemeImages);

module.exports = router;

