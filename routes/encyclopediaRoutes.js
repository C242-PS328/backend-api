const express = require("express");
const {
  identifyPlant,
  getAllPlants,
  getPlantById,
  getPlantByName,
} = require("../controllers/EncyclopediaController");
const router = express.Router();
const uploadFile = require("../middlewares/fileUpload");
const validateFile = require("../middlewares/validation");

router.post("/predict", uploadFile, validateFile, identifyPlant);
router.get("/search", async (req, res) => {
  await getPlantByName(req, res);
});
router.get("/", getAllPlants);
router.get("/:plant_id", async (req, res) => {
  await getPlantById(req, res);
});

module.exports = router;
