const { predict } = require("../utils/mlUtils");

const classLabels = [
  "Apple Apple scab", // 0
  "Apple Black rot", // 1
  "Apple Cedar apple rust", // 2
  "Apple healthy", // 3
  "Background without leaves", // 4
  "Blueberry healthy", // 5
  "Cherry Powdery mildew", // 6
  "Cherry healthy", // 7
  "Corn Cercospora leaf spot Gray leaf spot", // 8
  "Corn Common rust", // 9
  "Corn Northern Leaf Blight", // 10
  "Corn healthy", // 11
  "Grape Black rot", // 12
  "Grape Esca (Black Measles)", // 13
  "Grape Leaf blight (Isariopsis Leaf Spot)", // 14
  "Grape healthy", // 15
  "Orange Haunglongbing (Citrus greening)", // 16
  "Peach Bacterial spot", // 17
  "Peach healthy", // 18
  "Pepper bell Bacterial spot", // 19
  "Pepper bell healthy", // 20
  "Potato Early blight", // 21
  "Potato Late blight", // 22
  "Potato healthy", // 23
  "Raspberry healthy", // 24
  "Soybean healthy", // 25
  "Squash Powdery mildew", // 26
  "Strawberry Leaf scorch", // 27
  "Strawberry healthy", // 28
  "Tomato Bacterial spot", // 29
  "Tomato Early blight", // 30
  "Tomato Late blight", // 31
  "Tomato Leaf Mold", // 32
  "Tomato Septoria leaf spot", // 33
  "Tomato Spider mites Two-spotted spider mite", // 34
  "Tomato Target Spot", // 35
  "Tomato Tomato Yellow Leaf Curl Virus", // 36
  "Tomato Tomato mosaic virus", // 37
  "Tomato healthy", // 38
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
