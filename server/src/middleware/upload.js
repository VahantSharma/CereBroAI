const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Make sure upload directory exists
const uploadDir = "uploads/mri-scans";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExt}`;
    cb(null, filename);
  },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (
    !file.originalname.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|bmp|BMP|webp|WEBP|dicom|DICOM|dcm|DCM)$/
    )
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(null, false);
  }
  cb(null, true);
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});

module.exports = upload;
