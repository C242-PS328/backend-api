const express = require("express");
const diseaseRoutes = require("./routes/diseaseRoutes");
const encyclopediaRoutes = require("./routes/encyclopediaRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute
app.use("/diseases", diseaseRoutes);
app.use("/encyclopedias", encyclopediaRoutes);

module.exports = app;
