const express = require("express");
const multer = require("multer");
const {
  identifyPlant,
  getAllPlants,
  getPlantById,
  getPlantByName,
} = require("../controllers/EncyclopediaController");

const router = express.Router();
const upload = multer(); // Middleware untuk upload file

router.post("/predict", upload.single("image"), identifyPlant);
router.get("/search", async (req, res) => {
  await getPlantByName(req, res);
});
router.get("/", getAllPlants);
router.get("/:plant_id", async (req, res) => {
  await getPlantById(req, res);
});

module.exports = router;
