const mongoose = require("mongoose");
const userProfileController = require("../../controller/User/userProfileController");
const userAuth = require("../../middleware/auth");
const { upload } = require("../../middleware/multer");
const express = require("express"); // call express
const routes = express.Router();

routes.put(
  "/editDetails/:id",
  userAuth,
  upload.single("file_image"),
  userProfileController.updateUserProfile
);
routes.get("/viewuser/:id", userAuth, userProfileController.getViewUser);
routes.post("/registeruser", userProfileController.userRegister);
routes.post("/registeruserbyadmin", userProfileController.userRegisterByAdmin);
routes.post("/updateuser/:id", userProfileController.updateUser);
routes.post("/updateuserstatus/:id", userProfileController.updateuserstatus);
routes.post("/getalluser", userProfileController.getAllUser);
routes.post("/getdeleteduser", userProfileController.getDeletedUser);
routes.get(
  "/getalluserwithoutpagination",
  userProfileController.getAllUserWithoutpagination
);
// routes.post("/getusertransactionDetails/:id",userProfileController)
routes.delete("/deleteUser/:id", userProfileController.deleteUserProfile);
routes.post("/sendOtp", userProfileController.sendOtp);
routes.post("/resendOtp", userProfileController.resendOtp);
routes.post("/checkotp", userProfileController.checkOtp);
module.exports = routes;
