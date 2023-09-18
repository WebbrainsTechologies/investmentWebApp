const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const UserSubscriptionController = require("../../controller/UserSubscription/userSubscriptionController");
const { upload } = require("../../middleware/multer");

routes.post(
  "/addinvestment/:id",
  auth,
  upload.single("manual_purchase_image"),
  UserSubscriptionController.purchaseSubscription
);
// routes.get(
//   "/addinvestment/:id",
//   auth,
//   UserSubscriptionController.purchaseSubscription
// );
routes.post(
  "/changesubscribersubscriptionstatus/:id",
  auth,
  UserSubscriptionController.changeSubscriptionStatus
);
routes.post(
  "/getallsubscribersubscription",
  auth,
  UserSubscriptionController.getallSubscription
);
routes.post(
  "/getUserapprovedrejectsubscription",
  auth,
  UserSubscriptionController.getUserApproveRejectSubscription
);
routes.get(
  "/getUserapprovedsubscriptionwithoutpagination",
  auth,
  UserSubscriptionController.getUserApproveSubscriptionWithoutPagination
);
routes.post(
  "/changeWithdrawalRequest/:id",
  auth,
  UserSubscriptionController.changeWithdrawalRequest
);

routes.post(
  "/changeWithdrawalrequestbyadmin/:id",
  auth,
  UserSubscriptionController.changeWithdrawalRequestByAdmin
);

routes.post(
  "/getUserApprovedSubscription",
  auth,
  UserSubscriptionController.getUserApprovedSubscription
);

routes.post(
  "/getallwithdrawalrequest",
  auth,
  UserSubscriptionController.getallWithdrawalRequest
);

module.exports = routes;
