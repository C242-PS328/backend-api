# Tanamore Backend Service
Backend service for Tanamore, a plant disease detection and encyclopedia application.

---
## **Key Features**
- **Plant Disease Prediction with Machine Learning**: Uses machine learning models to detect plant diseases based on user-uploaded images.
- **Plant Type Prediction with Machine Learning**: Uses machine learning models to detect plant types based on user-uploaded images.
- **API Documentation with Swagger**: Comprehensive API with interactive documentation accessible via the `/docs` endpoint.
- **Encyclopedia Feature**: Provides an endpoint to read plant data in the encyclopedia.
- **Result Storage in Firestore**: Stores prediction results and plant data in Firestore for efficient data management.

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

## **Architecture Diagram**

![Tanamore Architecture](https://github.com/Tanamore/backend-api/blob/015cc09b8b653adde0b213e663249b2a28170e3b/image/TanamoreCloudArchitecture.png)

## **Architecture Flow**

User-uploaded images are processed through **Cloud Storage** and analyzed using machine learning models integrated with the backend. Prediction results and metadata are stored in **Firestore** for retrieval via API endpoints. Authentication is handled by **Firebase Authentication**, ensuring secure access. CI/CD pipelines are managed using **Cloud Build**, while the application is hosted on **Cloud Run** for scalability and serverless deployment.

Additional components like **Secret Manager** secure sensitive credentials, and **Artifact Registry** stores containerized application artifacts for smooth deployment workflows.


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

---

## **Available Scripts**
- `start`: Starts the application in production mode.
- `dev`: Runs the application in development mode with hot-reloading.
- `convert`: Import csv file into firestore database (if needed). 

---

## API Documentation

| Endpoint      | HTTP Method |  Description  |
| ------------- | ----------- | ------------- |
| /diseases/predict  | POST |  Predict disease plant
| /encyclopedias/predict  | POST | Identifying encyclopedia plant
| /encyclopedias  | GET |  Get all data encyclopedias
| /encyclopedias/:id  | GET | Get Plant Encyclopedia by `ID`
| /encyclopedias/search  | GET  | Get Plant Encyclopedia by `Name`

For more detail information about our `Documentation API` you can check the URL below  
`Documentation API` URL :  https://tanamore-be-539092052831.asia-southeast2.run.app/docs/ 

---

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

## **Prerequisites**

Before running the **Tanamore Backend Service**, ensure that you have the following installed and configured:

1. **Node.js**:
   - Ensure that **Node.js** version 18 or higher is installed. The exact version can be found in the `package.json` under the `engines` field.
   - **Node.js** is used as the runtime for running the backend server and managing dependencies.

   Install Node.js from the [official Node.js website](https://nodejs.org/en/).

2. **Google Cloud SDK**:
   - Install the **Google Cloud SDK** to manage Google Cloud services such as **Cloud Run**, **Firestore**, and **Cloud Storage**.
   - This SDK is also used for configuring application credentials and accessing Google Cloud services.

   Install the Google Cloud SDK from the [Google Cloud SDK documentation](https://cloud.google.com/sdk/docs/install).

3. **Google Cloud Project and Configuration**:
   - This project requires Google Cloud credentials to access **Cloud Storage** and **Firestore**.
   - Make sure you have a Google Cloud project set up and have enabled the necessary services such as **Firestore**, **Cloud Storage**, and **Cloud Run**.
   - Save the service account credentials file (usually in JSON format) and configure the path in the `.env` file under `GOOGLE_CREDENTIALS`.

4. **Cloud Firestore**:
   - **Firestore** is used to store prediction results and plant metadata.
   - You need to create a Firestore database in the Google Cloud Console and configure the proper access through Firebase or Google Cloud IAM.

5. **Cloud Storage**:
   - Ensure that you have configured **Cloud Storage** to store the uploaded plant images and machine learning models.
   - In the **Google Cloud Console**, create a storage bucket and set the appropriate access permissions to be used by the application.

6. **Environment Variables**:
   - Before running the application, make sure to set up the `.env` file based on the template in `.env.example` and fill in the required variables, such as:
     - `MODEL1_URL`: The URL or path to your machine learning model file.
     - `MODEL2_URL`: The URL or path to another model file if applicable.
     - `GOOGLE_CREDENTIALS`: The path to your Google Cloud service account credentials file.
     - `BUCKET_NAME`: The name of the storage bucket in Google Cloud.

   Ensure that the values in the `.env` file match the configuration in your Google Cloud Project.

Once these prerequisites are met, you are ready to run the Tanamore application and ensure smooth integration with Google Cloud services.
---
