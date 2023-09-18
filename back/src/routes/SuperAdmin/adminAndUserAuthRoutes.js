const adminAuthController = require("../../controller/SuperAdmin/adminAndUserAuthController");
const auth = require("../../middleware/auth");
const express = require("express"); // call express
const routes = express.Router();

routes.post("/adminuserlogin", adminAuthController.superadminlogin);
routes.get("/adminuserlogout", auth, adminAuthController.superadminlogout);
routes.post(
  "/adminuserchange-password",
  auth,
  adminAuthController.change_password
);
routes.post("/adminuserresetpassword", adminAuthController.resetpassword);
routes.post(
  "/adminuserforgetpassword",
  adminAuthController.superadminforgetpassword
);
routes.post("/adminusercheck", auth, adminAuthController.check);

module.exports = routes;
