const express = require("express");
const app = express();
const FuturePaymentRoutes = require("./futurePaymentRoutes");

app.use("/futurepaymentRoutes", FuturePaymentRoutes);

module.exports = app;
