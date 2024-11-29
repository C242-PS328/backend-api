const express = require("express");
const multer = require("multer");
const { detectDisease } = require("../controllers/DiseaseController");

const router = express.Router();
const upload = multer(); // Middleware untuk upload file

router.post("/predict", upload.single("image"), detectDisease);

module.exports = router;
