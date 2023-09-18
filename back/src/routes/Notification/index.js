const express = require("express");
const app = express();
const notificationapi = require("./notificationRoutes")

app.use("/notificationapi", notificationapi)

module.exports = app;