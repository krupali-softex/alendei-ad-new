// controllers/backgroundController.js
const axios = require("axios");

exports.fetchBackground = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    res.set("Content-Type", response.headers["content-type"] || "image/jpeg");
    res.set("Access-Control-Allow-Origin", "*");

    return res.send(Buffer.from(response.data, "binary"));
  } catch (err) {
    console.error("Image fetch failed:", err.message);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
};
