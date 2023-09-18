const express = require("express"); // call express
const app = express(); // define our app using express
const subscriptionCrudRoute = require("./subscriptionCrud");
const subscriptionRoute = require("./SubscriptionRoutes");

app.use("/subscriptioncrud", subscriptionCrudRoute);
app.use("/subscription",subscriptionRoute);

module.exports = app;
