# Tanamore Backend Service
Backend service for Tanamore, a plant disease detection and encyclopedia application.

---
## **Fitur Utama**
- **Prediksi Penyakit Tanaman dengan Machine Learning**: Menggunakan model machine learning untuk mendeteksi penyakit pada tanaman berdasarkan gambar yang diunggah pengguna.
- **Prediksi Jenis Tanaman dengan Machine Learning**: Menggunakan model machine learning untuk mendeteksi jenis tanaman berdasarkan gambar yang diunggah pengguna.
- **Dokumentasi API dengan Swagger**: API yang lengkap dengan dokumentasi interaktif yang dapat diakses melalui endpoint `/docs`.
- **Fitur Ensiklopedia**: Menyediakan endpoint untuk membaca data tanaman di ensiklopedia.
- **Penyimpanan Hasil di Firestore**: Menyimpan hasil prediksi dan data tanaman di Firestore untuk pengelolaan data yang efisien.

---

## **Technology**
- **Node.js**: JavaScript runtime for building scalable backend applications.
- **Nodemon**: For monitoring and hot reload during development.
- **Postman**: For API testing.
- **Google Cloud SDK**: For managing and interacting with Google Cloud services.

---

## **Tools/Frameworks**
- **Express.js**: Web framework for building RESTful APIs.
- **Multer**: Middleware for handling image uploads.
- **TensorFlow.js**: For integrating machine learning model inference.
- **Swagger**: For interactive API documentation.
- **dotenv**: To manage environment variables securely.
- **CSV Parser**: To process CSV files when needed.

---

## **Storage**
- **Firestore**: Storing prediction results, plant metadata, and user activity logs.
- **Cloud Storage**: Storing user-uploaded plant images and machine learning models.

---

## **Infrastructure**
- **Google Cloud Platform**:
  - **Cloud Run**: To host the backend API.
  - **Cloud IAM**: To manage access permissions for resources.
  - **Cloud Build**: For CI/CD pipeline integration.

---

## Folder Structure
```
. 
├── controllers/ 
│ ├── DiseaseController.js 
│ └── EncyclopediaController.js 
├── docs/ 
│ └── swagger.yaml 
├── middlewares/ 
│ └── fileUpload.js 
├── routes/ 
│ ├── diseaseRoutes.js 
│ └── encyclopediaRoutes.js 
├── utils/ 
│ ├── mlUtils.js 
│ └── responseUtils.js 
├── .env.example 
├── .gitignore 
├── Dockerfile 
├── app.js 
├── cloudbuild.yaml 
├── package-lock.json 
├── package.json 
└── server.js
```

### Structure Explanation
- **`controllers/`**: Contains logic for handling API requests related to diseases and encyclopedias.
- **`docs/`**: Contains Swagger documentation in YAML format.
- **`middlewares/`**: Middleware for handling file uploads (e.g., images).
- **`routes/`**: Defines API endpoints for diseases and encyclopedias.
- **`utils/`**: Utility functions for machine learning and response formatting.
- **`.env.example`**: Template for environment variables required by the application.  
- **`app.js`**: Configures the main Express application and its middleware, routes, and documentation.  
- **`server.js`**: Main entry point to start the server.
- **`cloudbuild.yaml`**: Configuration for Google Cloud Build.
- **`Dockerfile`**: Instructions to containerize the application.

## **How to Install**
1. Clone the repository and navigate to the directory:
    ```bash
    git clone https://github.com/your-org/tanamore-be.git
    cd tanamore-be
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    - Create a `.env` file based on `.env.example`.
    - Add your Google Cloud credentials and project configurations.

4. Run the service locally:
    ```bash
    npm start
    ```
    or in development mode with hot-reloading:
    ```bash
    npm run dev
    ```

---

## **Available Scripts**
- `start`: Starts the application in production mode.
- `dev`: Runs the application in development mode with hot-reloading.
- `convert`: Import csv file into firestore database (if needed). 

---


