const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const SubscriptionController = require("../../controller/Subscription/subscriptionController");

routes.post(
  "/changesubscriptionstatus/:id",
  auth,
  SubscriptionController.changeSubscriptionStatus
);

routes.post(
  "/getsubscriptionbyid/:id",
  auth,
  SubscriptionController.getSubscriptionById
);
routes.post(
  "/getallsubscription",
  auth,
  SubscriptionController.getallSubscription
);
routes.get(
  "/getsubscriptionswithoutpagination",
  auth,
  SubscriptionController.getallSubscriptionWithOutPagination
);
routes.get(
  "/getsubscriptionlistforsubscriberpage",
  auth,
  SubscriptionController.getallSubscriptionWithOutPaginationForSubscriberPage
);

module.exports = routes;
