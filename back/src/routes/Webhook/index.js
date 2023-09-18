const express = require("express"); // call express
const app = express(); // define our app using express
const WebhookRoute = require("./webhook");

app.use("/webhookroutes", WebhookRoute);

module.exports = app;
