const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const UserWalletController = require("../../controller/UserWallet/userWalletController");

routes.post(
  "/getalluserwalletData",
  auth,
  UserWalletController.getUserTransaction
);

routes.post(
  "/getalladmintransaction",
  auth,
  UserWalletController.getAdminTransaction
);

module.exports = routes;
