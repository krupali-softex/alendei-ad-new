const express = require("express");
const { generateImages } = require("../services/generateImageAI");

const router = express.Router();

router.post("/generate-images", generateImages);

module.exports = router;

