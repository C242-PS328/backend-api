const { predict } = require("../utils/mlUtils");

const classLabels = [
  "Apple Scab",
  "Black Rot on Apple",
  "Black Rot on Grape",
  "Cedar Apple Rust",
  "Cherry Powdery Mildey",
  "Corn Cercospora Leaf Spot Gray Leaf Spot",
  "Corn Common Rust",
  "Corn Healthy",
  "Corn Northern Leaf Blight",
  "Esca (Black Measles) on Grape",
  "Grape Leaf Blight",
  "Healthy Apple",
  "Healthy Blueberry",
  "Healthy Cherry",
  "Healthy Grape",
  "Healthy Peach",
  "Healthy Pepper Bell",
  "Healthy Potato",
  "Healthy Raspberry",
  "Healthy Soybean",
  "Healthy Strawberry",
  "Orange Huanglongbing (HLB) / Citrus Greening",
  "Peach Bacterial Spot",
  "Pepper Bell Bachterial Spot",
  "Potato Early Blight",
  "Potato Late Blight",
  "Squash Powdery Mildew",
  "Strawberrry Leaf Scorch",
  "Tomato Bacterial Spot",
  "Tomato Early Blight",
  "Tomato Healthy",
  "Tomato Late Blight",
  "Tomato Leaf Mold",
  "Tomato Mosaic Virus",
  "Tomato Septoria Leaf Spot",
  "Tomato Spider Mites Two Spotted",
  "Tomato Target Spot",
  "Tomato Yellow Leaf Curl Virus",
];

let diseaseModel; // Model deteksi penyakit

// Muat model saat server dimulai
(async () => {
  const { loadModel1 } = require("../utils/mlUtils");
  try {
    diseaseModel = await loadModel1();
    console.log("Disease model loaded successfully!");
  } catch (err) {
    console.error("Error loading disease model:", err.message);
    process.exit(1); // Keluar jika model gagal dimuat
  }
})();

const detectDisease = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    // Prediksi menggunakan model penyakit (input: 256x256)
    const predictions = await predict(
      diseaseModel,
      req.file.buffer,
      [256, 256]
    );

    // Cari hasil prediksi dengan confidence tertinggi
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);

    res.status(200).json({
      result: predictedClass,
      confidence: `${confidence}%`,
    });
  } catch (err) {
    console.error("Error in disease detection:", err.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

module.exports = { detectDisease };
