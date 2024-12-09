const multer = require("multer");
const { errorResponse } = require("../utils/responseUtils");

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
const uploadFile = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);

      // Error handling untuk ukuran file
      if (err.code === "LIMIT_FILE_SIZE") {
        return errorResponse(res, "File size exceeds the 3MB limit", 400);
      }

      // Error handling untuk jenis file
      if (err.message === "File must be an image") {
        return errorResponse(res, "Only image files are allowed", 400);
      }

      // Error lain
      return res.status(400).json({ status: "fail", error: err.message });
    }

    // Error jika file tidak ada
    if (!req.file || !req.file.buffer) {
      return errorResponse(res, "No image uploaded", 400);
    }

    next(); // Jika semua validasi berhasil, lanjutkan ke middleware berikutnya
  });
};

module.exports = uploadFile;
