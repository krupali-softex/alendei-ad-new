const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensures upload folder exists
function ensureUploadFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

// Reusable multer instance factory
function createUploader(folder = "uploads") {
  ensureUploadFolder(folder);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = path.basename(file.originalname, ext)
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");
      const timestamp = Date.now();
      cb(null, `${name}-${timestamp}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png files are allowed"));
    }
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 2 MB limit
    fileFilter,
  });
}

module.exports = createUploader;
