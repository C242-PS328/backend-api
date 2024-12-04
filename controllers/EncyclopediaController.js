const { predict } = require("../utils/mlUtils");
const db = require("../utils/database");

const classLabels = [
  "Aloe Vera",
  "Apple",
  "Areca Palm",
  "Birds Nest Fern",
  "Blueberry",
  "Cherry",
  "Chinese Evergreen",
  "Corn",
  "Dracaena",
  "Dumb Cane",
  "Elephant Ear",
  "Grape",
  "Monstera Deliciosa",
  "Peach",
  "Pepper Bell",
  "Polka Dot Plant",
  "Ponytail Palm",
  "Potato",
  "Raspberry",
  "Snake Plant",
  "Strawberry",
  "Tomato",
];

let encyclopediaModel; // Model deteksi jenis tanaman

// Muat model saat server dimulai
(async () => {
  const { loadModel2 } = require("../utils/mlUtils");
  try {
    encyclopediaModel = await loadModel2();
    console.log("Encyclopedia model loaded successfully!");
  } catch (err) {
    console.error("Error loading encyclopedia model:", err.message);
    process.exit(1);
  }
})();

const identifyPlant = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "fail",
        error: "No image uploaded.",
      });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        status: "fail",
        error: "Image size exceeds 10MB limit.",
      });
    }

    const predictions = await predict(
      encyclopediaModel,
      req.file.buffer,
      [224, 224]
    );

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);

    if (confidence < 50) {
      return res.status(400).json({
        status: "fail",
        error:
          "Prediction confidence is too low. The image might not match any known plant.",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM plant_encyclopedia WHERE plant_name = ?",
      [predictedClass]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        error: "Plant not found in the encyclopedia.",
      });
    }

    res.status(200).json({
      status: "success",
      result: predictedClass,
      confidence: `${confidence}%`,
      plantInfo: rows[0],
    });
  } catch (err) {
    console.error("Error in plant identification:", err.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error",
      details: err.message,
    });
  }
};

module.exports = { identifyPlant };
