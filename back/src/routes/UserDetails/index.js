const express = require("express"); // call express
const app = express(); // define our app using express
const userDetailRoute = require("./userDetails");

app.use("/userDetailRoutes", userDetailRoute);

module.exports = app;
