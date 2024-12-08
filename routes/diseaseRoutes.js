const express = require("express");
const { detectDisease } = require("../controllers/DiseaseController");
const router = express.Router();
const uploadFile = require("../middlewares/fileUpload");

router.post("/predict", uploadFile, detectDisease);

module.exports = router;
