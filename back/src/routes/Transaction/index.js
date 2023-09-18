const express = require("express"); // call express
const app = express(); // define our app using express
const transactionRoute = require("./transactionRoutes");

app.use("/transactionapi", transactionRoute);

module.exports = app;
