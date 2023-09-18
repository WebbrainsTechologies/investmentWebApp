const express = require("express"); // call express
const app = express(); // define our app using express
const adminAuthRoutes = require("./adminAndUserAuthRoutes");
const adminProfileRoutes = require("./adminProfileRoutes")

app.use("/auth", adminAuthRoutes);
app.use("/adminProfile",adminProfileRoutes);

module.exports = app;
