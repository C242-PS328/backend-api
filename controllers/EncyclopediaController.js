const { predict } = require("../utils/mlUtils");

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

let encyclopediaModel;
(async () => {
  const { loadModel2 } = require("../utils/mlUtils");
  try {
    encyclopediaModel = await loadModel2();
  } catch (err) {
    console.error("Error loading encyclopedia model:", err.message);
    process.exit(1);
  }
})();

const identifyPlant = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    // Prediksi menggunakan model ensiklopedia (input: 224x224)
    const predictions = await predict(
      encyclopediaModel,
      req.file.buffer,
      [224, 224]
    );

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);

    res.status(200).json({
      result: predictedClass,
      confidence: `${confidence}%`,
    });
  } catch (err) {
    console.error("Error in plant identification:", err.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

module.exports = { identifyPlant };
