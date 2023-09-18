const express = require("express");
const app = express();
const KycCrudRoutes = require("./kycCrudRoutes");

app.use("/kyccrud", KycCrudRoutes);

module.exports = app;
