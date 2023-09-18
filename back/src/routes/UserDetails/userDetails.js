const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const UserDetailController = require("../../controller/UserDetails/userDetailsController");

routes.post(
  "/getUserDetailDatafortotalinvestment/:id",
  auth,
  UserDetailController.getUserDetailsForTotalInvestment
);
routes.post(
  "/getUserDetailDatafortotalAsset/:id",
  auth,
  UserDetailController.getUserDetailsForTotalAsset
);
routes.post(
  "/getUserDetailDataforwithdrawal/:id",
  auth,
  UserDetailController.getUserDetailsForTotalWithdrawal
);
routes.post(
  "/getUserDetailDataforroiandcommision/:id",
  auth,
  UserDetailController.getUserDetailsForRoiAndCommision
);
routes.post(
  "/getUserDetailDataforwalletamount/:id",
  auth,
  UserDetailController.getUserDetailsForWalletAmount
);
routes.get(
  "/getUserapprovedsubscriptionwithoutpagination/:id",
  auth,
  UserDetailController.getUserApproveSubscriptionWithoutPagination
);
routes.post(
  "/getUserFuturPayoutByuserId/:id",
  auth,
  UserDetailController.getUserFuturePayout
);

module.exports = routes;
