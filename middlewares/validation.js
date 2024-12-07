// Validasi untuk memastikan file ada, ukuran tidak lebih dari 3MB, dan format gambar
const validateFile = (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return res
      .status(400)
      .json({ status: "fail", error: "No image uploaded." });
  }

  // Memeriksa ukuran file (menggunakan buffer.length jika menggunakan memoryStorage)
  if (req.file.buffer.length > 3 * 1024 * 1024) {
    // Maksimal 3MB
    return res.status(400).json({
      status: "fail",
      error: "Image size exceeds 3MB limit.",
    });
  }

  // Menambahkan pengecekan format gambar (opsional)
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      status: "fail",
      error: "Invalid file format. Only image files are allowed.",
    });
  }

  next();
};

module.exports = validateFile;
