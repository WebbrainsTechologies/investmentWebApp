const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const FuturePaymentController = require("../../controller/FuturePayment/futurePaymentController");

routes.post(
  "/getUserFuturPayout",
  auth,
  FuturePaymentController.getUserFuturePayout
);

routes.get(
  "/getDashboardUserFuturePayout",
  auth,
  FuturePaymentController.getUserDashboardFuturePayout
);

module.exports = routes;
