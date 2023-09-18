const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const DashboardController = require("../../controller/Dashboard/dashboardController");

routes.get(
  "/getUserDashboardDatafortotalinvestment/:id",
  auth,
  DashboardController.getUserDashboardDataForTotalInvestment
);
routes.get(
  "/getUserDashboardDatafortotalasset/:id",
  auth,
  DashboardController.getUserDashboardDataForTotalAsset
);
routes.get(
  "/getUserDashboardDatafortotalmonthincome/:id",
  auth,
  DashboardController.getUserDashboardDataForCurrentMonthIncome
);
routes.get(
  "/getUserDashboardDataforwalletamount/:id",
  auth,
  DashboardController.getUserDashboardDataForWalletAmount
);

routes.get(
  "/getUserPurchesedSubscription",
  auth,
  DashboardController.getUserPurchesedSubscription
);

routes.get(
  "/getAdminDashboadSubscriptionData",
  auth,
  DashboardController.getAdminDashboardSubscriptionData
);

routes.get(
  "/getAdminDashboadSubscription",
  auth,
  DashboardController.getAdminDashboardSubscription
);

routes.get(
  "/getAdminDashboardData/:id",
  auth,
  DashboardController.getAdminDashboardData
);
routes.post(
  "/getAdminSelectedMonthDataWithdrawalData/:id",
  auth,
  DashboardController.getAdminDashboardWithdrawalDatabyMonth
);
routes.get(
  "/getAdminDashboardPendingWithdrawalData/:id",
  auth,
  DashboardController.getAdminDashboardPendingWithdrawalData
);
routes.get(
  "/getAdminDashboardChartData/:id",
  auth,
  DashboardController.getAdminDashboardChartData
);

routes.post(
  "/editAdminWalletBalance/:id",
  auth,
  DashboardController.editAdminWalletBalance
);

routes.get(
  "/getAdminWalletBalance/:id",
  auth,
  DashboardController.getAdminWalletBalance
);

routes.get(
  "/getTotalAssetForAdmin/:id",
  auth,
  DashboardController.getAdminDashboardTotalAsset
);

module.exports = routes;
