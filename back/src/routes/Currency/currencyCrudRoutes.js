const express = require("express");
const app = express();
const auth = require("../../middleware/auth");
const routes = express.Router();
const CurrencyCrudController = require("../../controller/Currency/CurrencyCrudController");
const { upload } = require("../../middleware/multer");

routes.post(
  "/addcurrency",
  auth,
  // upload.single("currency_logo"),
  CurrencyCrudController.addCurrency
);
routes.post(
  "/editcurrency/:id",
  auth,
  // upload.single("currency_logo"),
  CurrencyCrudController.editCurrency
);
routes.delete(
  "/deletecurrency/:id",
  auth,
  CurrencyCrudController.deleteCurrency
);

module.exports = routes;
