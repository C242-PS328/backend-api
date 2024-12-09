const express = require("express");
const diseaseRoutes = require("./routes/diseaseRoutes");
const encyclopediaRoutes = require("./routes/encyclopediaRoutes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();

const swaggerDocument = YAML.load("./docs/swagger.yaml");

const admin = require("firebase-admin");

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rute
app.use("/diseases", diseaseRoutes);
app.use("/encyclopedias", encyclopediaRoutes);

module.exports = app;
