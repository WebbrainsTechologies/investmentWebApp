const express = require("express"); // call express
const app = express(); // define our app using express
const userWalletRoute = require("./userWalletRoutes");

app.use("/userWalletroutes", userWalletRoute);

module.exports = app;
