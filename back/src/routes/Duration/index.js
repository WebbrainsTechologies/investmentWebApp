const express = require("express");
const app = express();
const DurationCrudRoutes = require("./durationCrudRoutes");
const DurationRoutes = require("./durationRoutes");

app.use("/durationcrud", DurationCrudRoutes);
app.use("/duration", DurationRoutes);

module.exports = app;