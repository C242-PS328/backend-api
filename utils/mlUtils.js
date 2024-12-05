const tfjs = require("@tensorflow/tfjs-node");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

// Fungsi untuk memuat model penyakit dari URL GCS
async function loadModel1() {
  const modelURL =
    "https://storage.googleapis.com/tanamore/models/disease_model/model.json";
  const model = await tfjs.loadLayersModel(modelURL);
  return model;
}

// Fungsi untuk memuat model ensiklopedia dari URL GCS
async function loadModel2() {
  const modelURL =
    "https://storage.googleapis.com/tanamore/models/encyclopedia_model/model.json";
  const model = await tfjs.loadLayersModel(modelURL);
  return model;
}

// Fungsi untuk melakukan prediksi dengan model
async function predict(model, imageBuffer, imageSize) {
  try {
    // Decode gambar dan pastikan valid
    const tensor = tfjs.node
      .decodeImage(imageBuffer, 3) // Pastikan gambar adalah RGB
      .resizeNearestNeighbor(imageSize) // Resize sesuai model
      .toFloat()
      .div(tfjs.scalar(255.0)) // Normalisasi nilai piksel
      .expandDims(); // Tambahkan dimensi batch

    const predictions = await model.predict(tensor).data();
    return predictions;
  } catch (err) {
    throw new Error(
      "Error during prediction. Ensure the image format is valid."
    );
  }
}

module.exports = { predict, loadModel1, loadModel2 };
