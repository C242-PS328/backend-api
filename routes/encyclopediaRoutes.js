const express = require("express");
const {
  identifyPlant,
  getAllPlants,
  getPlantById,
  getPlantByName,
} = require("../controllers/EncyclopediaController");
const router = express.Router();
const uploadFile = require("../middlewares/fileUpload");

router.post("/predict", uploadFile, identifyPlant);
router.get("/search", async (req, res) => {
  await getPlantByName(req, res);
});
router.get("/", getAllPlants);
router.get("/:plant_id", async (req, res) => {
  await getPlantById(req, res);
});

module.exports = router;
