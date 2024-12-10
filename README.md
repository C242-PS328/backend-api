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

