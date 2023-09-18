const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const TransactionController = require("../../controller/Transaction/transactionController");

routes.post(
  "/getallusertransaction",
  auth,
  TransactionController.getUserTransaction
);
routes.post(
  "/get-commision-payout",
  auth,
  TransactionController.getCommisionPayout
);

routes.post(
  "/getalladmintransaction",
  auth,
  TransactionController.getAdminTransaction
);

module.exports = routes;
