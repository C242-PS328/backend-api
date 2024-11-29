const express = require("express");
const multer = require("multer");
const { identifyPlant } = require("../controllers/EncyclopediaController");

const router = express.Router();
const upload = multer(); // Middleware untuk upload file

router.post("/predict", upload.single("image"), identifyPlant);

module.exports = router;
