const { predict, loadModelEncyclopedia } = require("../utils/mlUtils");
const { errorResponse, successResponse } = require("../utils/responseUtils");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

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
// Fungsi upload image ke bucket
const uploadImageToBucket = async (imageBuffer, filename) => {
  try {
    const folderPath = "user_uploads_encyclopedia/"; // Folder yang diinginkan di dalam bucket
    const fullFilename = `${folderPath}${filename}`; // Gabungkan folder dan nama file

    const bucket = storage.bucket(process.env.BUCKET_NAME);
    const file = bucket.file(fullFilename);

    // Upload file ke bucket
    await file.save(imageBuffer, {
      resumable: false,
      contentType: "image/jpeg", // Sesuaikan dengan tipe file yang di-upload
    });

    return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fullFilename}`; // URL file yang di-upload
  } catch (error) {
    console.error("Error uploading image to bucket:", error.message);
    throw new Error("Failed to upload image to the cloud storage."); // Lempar error jika gagal
  }
};
// Fungsi untuk identifikasi tanaman berdasarkan gambar yang diunggah
const identifyPlant = async (req, res) => {
  try {
    // Lakukan prediksi pada gambar
    const predictions = await predict(
      encyclopediaModel,
      req.file.buffer,
      [224, 224],
    );

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);
    const plantId = `plant_${maxIndex.toString().padStart(2, "0")}`;
    const filename = `${generateCustomId()}.jpg`;

    // Upload image to Cloud Storage
    const imageUrl = await uploadImageToBucket(req.file.buffer, filename);

    if (confidence < 50) {
      // Gagal jika tingkat keyakinan prediksi terlalu rendah
      return errorResponse(
        res,
        "Prediction confidence is too low. The image might not match any known plant.",
        400,
      );
    }

    // Query Firestore untuk mendapatkan detail tanaman
    const firestore = require("firebase-admin").firestore();
    const snapshot = await firestore
      .collection("plant_encyclopedias")
      .where("plant_name", "==", predictedClass)
      .get();

    if (!doc.exists) {
      return errorResponse(res, "Plant not found in the database", 404);
    }

    const plantInfo = doc.data();

    // Simpan hasil prediksi ke Firestore
    const predictionData = {
      id: generateCustomId(), // ID unik dengan timestamp dan bagian acak
      plantId,
      predictedClass,
      confidence: `${confidence}%`,
      imageUrl,
      createdAt: new Date(),
      plantInfo, // Detail tanaman
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
        imageUrl,
      },
      "Success predict plant",
      201,
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
      200,
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
      return errorResponse(res, "Invalid or missing plant name", 400);
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
      return errorResponse(res, "Plant not found in encyclopedia", 404);
    }
    // Berhasil mendapatkan data tanaman berdasarkan nama
    return successResponse(res, results, "Success get plant by name", 200);
  } catch (error) {
    console.error("Error fetching plant by Name", error.message);
    return errorResponse(res, "Error fetching plant by Name", 500);
  }
};

module.exports = { identifyPlant, getPlantById, getPlantByName, getAllPlants };
