const multer = require("multer");

// Set storage engine
const storage = multer.memoryStorage();

// Set file size limit (3MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Maksimal 3MB
  fileFilter: (req, file, cb) => {
    // Membatasi jenis file (misalnya hanya gambar)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File must be an image"), false);
    }
    cb(null, true);
  },
}).single("image"); // Ganti "image" dengan field name yang digunakan dalam form

// Middleware untuk upload file
const uploadFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ status: "fail", error: "File size exceeds the 3MB limit." });
      }
      if (err.message === "File must be an image") {
        return res
          .status(400)
          .json({ status: "fail", error: "Only image files are allowed." });
      }
      return res.status(400).json({ status: "fail", error: err.message });
    }
    next();
  });
};

module.exports = uploadFile;
