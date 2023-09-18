const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const WithdrawalController = require("../../controller/Withdrawal/withdrawal");
const { upload } = require("../../middleware/multer");

routes.post(
  "/addwithdrawalrequest",
  auth,
  // upload.single(""),
  WithdrawalController.AddWithdrawRequest
);
// routes.get(
//   "/addinvestment/:id",
//   auth,
//   WithdrawalController.purchaseSubscription
// );
routes.post(
  "/changewithdrawalrequeststatus/:id",
  auth,
  upload.single("withdrawal_file"),
  WithdrawalController.changeWithdrawalRequestStatus
);
routes.post(
  "/getallwithdrawalrequestsforadmin",
  auth,
  WithdrawalController.getallWithdrawalRequest
);
routes.post(
  "/getallwithdrawalrequestsforuser",
  auth,
  WithdrawalController.getallWithdrawalRequestForUser
);

routes.post(
  "/checkpendingwithdrawal",
  auth,
  WithdrawalController.checkPendingWithdrawal
);

module.exports = routes;
