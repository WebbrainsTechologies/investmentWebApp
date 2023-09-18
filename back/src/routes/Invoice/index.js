const express = require("express");
const app = express();
const InvoiceRoutes = require("./invoiceRoutes");

app.use("/invoiceRoutes", InvoiceRoutes);

module.exports = app;
