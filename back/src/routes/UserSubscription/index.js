const express = require("express"); // call express
const app = express(); // define our app using express
const usersubscriptionRoute = require("./userSubscriptionRoutes");

app.use("/usersubscription", usersubscriptionRoute);

module.exports = app;
