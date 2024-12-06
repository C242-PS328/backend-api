const { predict, loadModelEncyclopedia } = require("../utils/mlUtils");

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
  try {
    encyclopediaModel = await loadModelEncyclopedia();
    console.log("Encyclopedia model loaded successfully!");
  } catch (err) {
    console.error("Error loading encyclopedia model:", err.message);
    process.exit(1);
  }
})();

const generateCustomId = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
};

const identifyPlant = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "fail",
        error: "No image uploaded.",
      });
    }

    if (req.file.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        status: "fail",
        error: "Image size exceeds 3MB limit.",
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

    // Query Firestore untuk mendapatkan detail tanaman
    const firestore = require("firebase-admin").firestore();
    const snapshot = await firestore
      .collection("plant_encyclopedias")
      .where("plant_name", "==", predictedClass)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        error: "Plant not found in the encyclopedia.",
      });
    }

    const plantInfo = snapshot.docs[0].data();

    // Simpan hasil prediksi ke Firestore
    const predictionData = {
      id: generateCustomId(), // ID unik dengan timestamp dan bagian acak
      predictedClass,
      confidence: `${confidence}%`,
      plantInfo, // Detail tanaman
      createdAt: new Date(),
    };

    try {
      await firestore
        .collection("encyclopedia_predictions")
        .doc(predictionData.id)
        .set(predictionData);
    } catch (error) {
      console.error("Error saving prediction to Firestore:", error.message);
      return res.status(500).json({
        status: "error",
        error: "Failed to save prediction in Firestore.",
      });
    }

    // Respon sukses dengan hasil prediksi
    res.status(200).json({
      status: "success",
      result: predictedClass,
      confidence: `${confidence}%`,
      plantInfo,
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

const getAllPlants = async (req, res) => {
  const firestore = require("firebase-admin").firestore();

  try {
    // Query semua dokumen di koleksi plant_encyclopedias
    const snapshot = await firestore.collection("plant_encyclopedias").get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: "fail",
        message: "Tidak ada data di ensiklopedia tanaman.",
      });
    }

    // Ambil semua data dokumen
    const plants = snapshot.docs.map((doc) => ({
      id: doc.id, // Tambahkan ID dokumen
      ...doc.data(),
    }));

    res.status(200).json({
      status: "success",
      data: plants,
    });
  } catch (error) {
    console.error("Error saat mengambil semua data tanaman:", error.message);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data.",
      details: error.message,
    });
  }
};

const getPlantById = async (req, res) => {
  const { plant_id } = req.params; // Ambil plant_id dari parameter URL
  const firestore = require("firebase-admin").firestore();

  if (!plant_id || typeof plant_id !== "string") {
    return res.status(400).json({
      status: "fail",
      error: "Invalid or missing plant_id.",
    });
  }

  try {
    // Cari dokumen di koleksi plant_encyclopedias berdasarkan plant_id
    const doc = await firestore
      .collection("plant_encyclopedias")
      .doc(plant_id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        status: "fail",
        error: "Plant not found in the encyclopedia.",
      });
    }

    const plantInfo = doc.data(); // Ambil data dari dokumen
    res.status(200).json({
      status: "success",
      plantInfo,
    });
  } catch (error) {
    console.error("Error fetching plant by ID:", error.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error",
      details: error.message,
    });
  }
};

const getPlantByName = async (req, res) => {
  const { name } = req.query; // Ambil nama tanaman dari query parameter
  const firestore = require("firebase-admin").firestore();

  try {
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Nama tanaman tidak diberikan atau tidak valid.",
      });
    }

    // Normalize nama input user untuk pencarian (lowercase)
    const searchTerm = name.toLowerCase();

    const collection = firestore.collection("plant_encyclopedias");

    // Ambil semua data, lalu filter secara manual (jika substrings dibutuhkan)
    const snapshot = await collection.get();

    // Filter data berdasarkan substring dalam nama atau nama ilmiah
    const results = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((plant) => {
        const plantName = (plant.plant_name || "").toLowerCase();
        const scientificName = (plant.scientific_name || "").toLowerCase();
        return (
          plantName.includes(searchTerm) || scientificName.includes(searchTerm)
        );
      });

    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Tidak ada data tanaman yang cocok dengan '${name}'.`,
      });
    }

    res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    console.error("Error saat mencari tanaman:", error.message);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mencari data tanaman.",
      details: error.message,
    });
  }
};

module.exports = { identifyPlant, getPlantById, getPlantByName, getAllPlants };
