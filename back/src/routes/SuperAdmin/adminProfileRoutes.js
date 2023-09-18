const mongoose = require("mongoose");
const adminProfileController = require("../../controller/SuperAdmin/adminProfileController");
const auth = require("../../middleware/auth");
const express = require("express");
const routes = express.Router();
const { upload } = require("../../middleware/multer");

// const routes = (app) => {
routes.post("/getAdmin", auth, adminProfileController.getAdmin);
routes.post(
  "/update-admin-status/:id",
  auth,
  adminProfileController.updateUserStatus
);
routes.post("/editAdmin/:id", auth, adminProfileController.updateAdminProfile);

routes.get("/viewAdmin/:id", auth, adminProfileController.getAdminProfile);

routes.delete(
  "/deleteAdmin/:id",
  auth,
  adminProfileController.deleteAdminProfile
);

routes.put(
  "/editprofile",
  auth,
  upload.single("profile_img"),
  adminProfileController.update_admin_profile
);

routes.get("/profile", auth, adminProfileController.get_superadmin_profile);

// };

module.exports = routes;
