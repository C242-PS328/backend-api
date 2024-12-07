const { predict, loadModelEncyclopedia } = require("../utils/mlUtils");
const { errorResponse, successResponse } = require("../utils/responseUtils");

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

// Fungsi untuk menghasilkan ID unik
const generateCustomId = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
};

// Fungsi untuk identifikasi tanaman berdasarkan gambar yang diunggah
const identifyPlant = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      // Gagal jika tidak ada file gambar
      return errorResponse(res, "No image uploaded", 400);
    }

    if (req.file.size > 3 * 1024 * 1024) {
      // Gagal jika ukuran file melebihi 3MB
      return errorResponse(res, "Image size exceeds 3MB limit.", 400);
    }

    // Lakukan prediksi pada gambar
    const predictions = await predict(
      encyclopediaModel,
      req.file.buffer,
      [224, 224]
    );

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);

    if (confidence < 50) {
      // Gagal jika tingkat keyakinan prediksi terlalu rendah
      return errorResponse(
        res,
        "Prediction confidence is too low. The image might not match any known plant.",
        400
      );
    }

    // Query Firestore untuk mendapatkan detail tanaman
    const firestore = require("firebase-admin").firestore();
    const snapshot = await firestore
      .collection("plant_encyclopedias")
      .where("plant_name", "==", predictedClass)
      .get();

    if (snapshot.empty) {
      // Gagal jika tanaman tidak ditemukan di ensiklopedia
      return errorResponse(res, "Plant not found in the encyclopedia.", 404);
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
      return errorResponse(res, "Failed to save prediction in Firestore.", 500);
    }
    // Berhasil menyimpan prediksi ke Firestore
    successResponse(
      res,
      {
        result: predictedClass,
        confidence: `${confidence}`,
        plantInfo,
      },
      "Success predict plant",
      201
    );
  } catch (err) {
    console.error("Error in plant identification:", err.message);
    return errorResponse(res, "Error in plant identification:", 500);
  }
};

// Fungsi untuk mendapatkan semua tanaman di ensiklopedia
const getAllPlants = async (req, res) => {
  const firestore = require("firebase-admin").firestore();

  try {
    // Query semua dokumen di koleksi plant_encyclopedias
    const snapshot = await firestore.collection("plant_encyclopedias").get();

    if (snapshot.empty) {
      // Gagal jika tidak ada data
      return errorResponse(res, "No data found in the encyclopedia", 404);
    }

    // Ambil semua data dokumen
    const plants = snapshot.docs.map((doc) => ({
      id: doc.id, // Tambahkan ID dokumen
      ...doc.data(),
    }));

    // Berhasil mengambil semua data ensiklopedia tanaman
    return successResponse(
      res,
      plants,
      "Plants encyclopedia retrieved successfully",
      200
    );
  } catch (error) {
    console.error("An error occurred while retrieving data:", error.message);
    return errorResponse(res, "An error occurred while retrieving data", 500);
  }
};

// Fungsi untuk mendapatkan data tanaman berdasarkan ID
const getPlantById = async (req, res) => {
  const { plant_id } = req.params; // Ambil plant_id dari parameter URL
  const firestore = require("firebase-admin").firestore();

  if (!plant_id || typeof plant_id !== "string") {
    // Gagal jika plant_id tidak valid atau tidak ada
    return errorResponse(res, "Invalid or missing plant_id", 400);
  }

  try {
    // Cari dokumen di koleksi plant_encyclopedias berdasarkan plant_id
    const doc = await firestore
      .collection("plant_encyclopedias")
      .doc(plant_id)
      .get();

    if (!doc.exists) {
      // Gagal jika tanaman tidak ditemukan
      return errorResponse(res, "Plant not found in the encyclopedia.", 404);
    }
    const plantInfo = doc.data(); // Ambil data dari dokumen
    // Berhasil mendapatkan data tanaman berdasarkan ID
    return successResponse(res, plantInfo, "Success get plant by id", 200);
  } catch (error) {
    console.error("Error fetching plant by ID:", error.message);
    return errorResponse(res, "Error fetching plant by ID", 500);
  }
};

// Fungsi untuk mendapatkan data tanaman berdasarkan nama
const getPlantByName = async (req, res) => {
  const { name } = req.query; // Ambil nama tanaman dari query parameter
  const firestore = require("firebase-admin").firestore();

  try {
    if (!name || typeof name !== "string") {
      // Gagal jika nama tidak valid atau tidak diberikan
      return errorResponse(
        res,
        "Invalid or missing plant name",
        400
      );
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
      // Gagal jika tidak ada data yang cocok
      return errorResponse(
        res,
        "Plant not found in encyclopedia",
        404
      );
    }
    // Berhasil mendapatkan data tanaman berdasarkan nama
    return successResponse(res, results, "Success get plant by name", 200);
  } catch (error) {
    console.error("Error fetching plant by Name", error.message);
    return errorResponse(res, "Error fetching plant by Name", 500);
  }
};

module.exports = { identifyPlant, getPlantById, getPlantByName, getAllPlants };
