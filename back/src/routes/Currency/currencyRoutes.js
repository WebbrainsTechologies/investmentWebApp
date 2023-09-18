const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const CurrencyController = require("../../controller/Currency/CurrencyController");

routes.post("/getallcurrency", auth, CurrencyController.getallCurrency);
routes.get(
  "/getallcurrencywithoutpagination",
  auth,
  CurrencyController.getallCurrencywithoutpagination
);
routes.get("/getcurrencybyid/:id", auth, CurrencyController.getCurrencyById);

module.exports = routes;
