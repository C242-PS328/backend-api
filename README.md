# Tanamore Backend Service API
Backend service Tanamore App for detecting diseases and identifying plants using machine learning.  

## Tech Stack
- Node JS (Runtime JS)
- Express JS (Framework Backend Service)
- Tensorflow JS (For Integrate Machine Learning Models)

## Tools
- Postman (Testing API)
- VS Code (Development)

## Infrastructure
- Google Cloud Platform

## Storage
- Firebase (For authentication users)
- Firestore (For store data prediction and database encyclopedia plants)
- Cloud Storage (For store the models and images)

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
