const { getThemeImages } = require("../services/s3Service");

const fetchThemeImages = async (req, res) => {
  const { businessCategory } = req.params;

  try {
    const images = await getThemeImages(businessCategory);
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch theme images" });
  }
};


module.exports = { fetchThemeImages };
