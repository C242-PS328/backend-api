const admin = require("firebase-admin");
const csv = require("csv-parser");
const fs = require("fs");
require("dotenv").config(); // Memuat variabel dari .env file

// Inisialisasi Firebase Admin SDK
const serviceAccount = require(process.env.GOOGLE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Fungsi untuk mengimpor data CSV ke Firestore
async function importCSVToFirestore(csvPath, collectionName) {
  const data = [];

  // Membaca file CSV
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed. Importing to Firestore...");

      for (let doc of data) {
        // Pastikan plant_id ada, merupakan string, dan tidak kosong
        const docId =
          doc.plant_id &&
          typeof doc.plant_id === "string" &&
          doc.plant_id.trim() !== "";

        if (!docId) {
          console.error("Invalid or missing plant_id, skipping row:", doc);
          continue; // Lewati baris jika plant_id tidak valid
        }

        // Logging untuk memverifikasi plant_id
        console.log("Importing document with plant_id:", doc.plant_id);

        // Simpan plant_id sebagai bagian dari data dokumen
        const plantData = { ...doc }; // Salin seluruh data dari baris
        // plant_id tetap ada di dalam data, tidak dihapus

        try {
          // Menyimpan data ke Firestore dengan plant_id sebagai ID dokumen
          await db.collection(collectionName).doc(doc.plant_id).set(plantData);
          console.log(
            `Document with plant_id ${doc.plant_id} imported successfully.`
          );
        } catch (error) {
          console.error(
            `Error importing document with plant_id ${doc.plant_id}:`,
            error
          );
        }
      }
      console.log("Import completed!");
    });
}

// Contoh penggunaan:
importCSVToFirestore("data.csv", "testing2");

// module.exports = { importCSVToFirestore };
