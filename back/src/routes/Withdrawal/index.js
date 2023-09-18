const express = require("express"); // call express
const app = express(); // define our app using express
const userwithdrawalRoute = require("./withdrawalRoutes");

app.use("/withdrawal", userwithdrawalRoute);

module.exports = app;
