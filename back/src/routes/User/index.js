const mongoose = require("mongoose");
const express = require("express"); // call express
const app = express(); // define our app using express
const userProfileRoutes = require("./userProfileRoutes");

app.use("/userProfile", userProfileRoutes);

module.exports = app;
