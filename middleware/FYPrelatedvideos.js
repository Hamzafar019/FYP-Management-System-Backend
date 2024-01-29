const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Function to ensure that the destination folder exists
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Destination folder for storing videos
const destinationFolder = "FYP_data/FYP_related_videos/";

// Ensure that the destination folder exists
ensureFolderExists(destinationFolder);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
