const subscriptionCrudController = require("../../controller/Subscription/subscriptionCrudController");
const auth = require("../../middleware/auth");
const express = require("express"); // call express
const routes = express.Router();

routes.post(
  "/addsubscription",
  auth,
  subscriptionCrudController.addSubscription
);
routes.post(
  "/editsubscription/:id",
  auth,
  subscriptionCrudController.editSubscription
);
routes.delete(
  "/deletesubscription/:id",
  auth,
  subscriptionCrudController.deleteSubscription
);

module.exports = routes;
