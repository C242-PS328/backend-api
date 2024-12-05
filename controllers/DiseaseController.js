const { predict } = require("../utils/mlUtils");
const { v4: uuidv4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucketName = "tanamore";

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

const generateCustomId = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
};

const detectDisease = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ status: "fail", error: "No image uploaded." });
    }

    if (req.file.size > 3 * 1024 * 1024) {
      return res
        .status(400)
        .json({ status: "fail", error: "Image size exceeds 3MB limit." });
    }

    const predictions = await predict(
      diseaseModel,
      req.file.buffer,
      [256, 256]
    );
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = classLabels[maxIndex];
    const confidence = (predictions[maxIndex] * 100).toFixed(2);
    const diseaseId = `disease_${maxIndex.toString().padStart(2, "0")}`;
    const filename = `${generateCustomId()}.jpg`;

    // Upload image to Cloud Storage
    const imageUrl = await uploadImageToBucket(req.file.buffer, filename);

    // Query Firestore
    const firestore = require("firebase-admin").firestore();
    const docRef = firestore.collection("plant_diseases").doc(diseaseId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: "fail",
        error: "Disease not found in the database.",
        predictedClass,
        confidence: `${confidence}%`,
        imageUrl,
      });
    }

    const diseaseInfo = doc.data();

    // Prepare Firestore Data
    const predictionData = {
      id: generateCustomId(), // ID dengan format custom
      diseaseId,
      predictedClass,
      confidence,
      imageUrl,
      createdAt: new Date(),
      diseaseInfo, // Tambahkan detail penyakit ke Firestore
    };

    // Save to Firestore
    try {
      await firestore
        .collection("disease_predictions")
        .doc(predictionData.id)
        .set(predictionData); // Gunakan .set() agar ID yang custom dipakai
    } catch (error) {
      console.error("Error saving to Firestore:", error.message);
      return res
        .status(500)
        .json({ status: "error", error: "Failed to save data in Firestore." });
    }

    // Send Response
    res.status(200).json({
      status: "success",
      result: predictedClass,
      confidence: `${confidence}%`,
      diseaseInfo,
      imageUrl,
    });
  } catch (err) {
    console.error("Error in disease detection:", err.message);
    res.status(500).json({
      status: "error",
      error: "Internal server error",
      details: err.message,
    });
  }
};

const uploadImageToBucket = async (imageBuffer, filename) => {
  try {
    const folderPath = "user_uploads/"; // Folder yang diinginkan di dalam bucket
    const fullFilename = `${folderPath}${filename}`; // Gabungkan folder dan nama file

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fullFilename);

    // Upload file ke bucket
    await file.save(imageBuffer, {
      resumable: false,
      contentType: "image/jpeg", // Sesuaikan dengan tipe file yang di-upload
    });

    return `https://storage.googleapis.com/${bucketName}/${fullFilename}`; // URL file yang di-upload
  } catch (error) {
    console.error("Error uploading image to bucket:", error.message);
    throw new Error("Failed to upload image to the cloud storage."); // Lempar error jika gagal
  }
};

module.exports = { detectDisease };
