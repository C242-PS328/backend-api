const tfjs = require("@tensorflow/tfjs-node");

async function loadModel1(modelPath) {
  try {
    const modelUrl = "file://models/disease_model/model.json";
    const model = await tfjs.loadLayersModel(modelUrl);
    console.log("Model loaded successfully!");
    return model;
  } catch (err) {
    throw new Error("Failed to load model. Check the model path and format.");
  }
}

async function loadModel2(modelPath) {
  try {
    const modelUrl = "file://models/encyclopedia_model/model.json";
    const model = await tfjs.loadLayersModel(modelUrl);
    console.log("Model loaded successfully!");
    return model;
  } catch (err) {
    throw new Error("Failed to load model. Check the model path and format.");
  }
}

async function predict(model, imageBuffer, inputSize) {
  try {
    const tensor = tfjs.node.decodeImage(imageBuffer);
    console.log("Original image shape:", tensor.shape);

    // Resize ke ukuran yang diharapkan model
    const resizedTensor = tensor
      .resizeNearestNeighbor(inputSize) // Resize ke dimensi input model
      .toFloat()
      .div(tfjs.scalar(255.0)) // Normalisasi
      .expandDims();

    console.log("Resized image shape:", resizedTensor.shape);

    const predictions = await model.predict(resizedTensor).data();
    return predictions;
  } catch (err) {
    throw new Error(`Error during prediction: ${err.message}`);
  }
}

module.exports = { loadModel1, loadModel2, predict };
