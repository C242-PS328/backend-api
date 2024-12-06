const express = require("express");
const { detectDisease } = require("../controllers/DiseaseController");
const router = express.Router();
const uploadFile = require("../middlewares/fileUpload");
const validateFile = require("../middlewares/validation");

router.post("/predict", uploadFile, validateFile, detectDisease);

module.exports = router;
