const express = require("express");
const app = express();
const CurrencyCrudRoutes = require("./currencyCrudRoutes");
const CurrencyRoutes = require("./currencyRoutes");

app.use("/currencycrud", CurrencyCrudRoutes);
app.use("/currency", CurrencyRoutes);

module.exports = app;