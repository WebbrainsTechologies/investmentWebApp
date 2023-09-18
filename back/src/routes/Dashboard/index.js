const express = require("express");
const app = express();
const DashboardRoutes = require("./dashboardRoutes");

app.use("/dashboardRoutes", DashboardRoutes);

module.exports = app;
