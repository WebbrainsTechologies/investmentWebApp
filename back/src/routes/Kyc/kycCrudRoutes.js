const express = require("express");
const app = express();
const auth = require("../../middleware/auth");
const routes = express.Router();
const KycCrudController = require("../../controller/Kyc/kycController");
const { upload } = require("../../middleware/multer");

routes.post(
  "/addkyc/:id",
  auth,
  upload.fields([
    { name: "front_image" },
    { name: "back_image" },
    { name: "selfi_image" },
  ]),
  KycCrudController.addKyc
);
routes.post(
  "/editkyc/:id",
  auth,
  upload.fields([
    { name: "front_image" },
    { name: "back_image" },
    { name: "selfi_image" },
  ]),
  KycCrudController.editKyc
);

routes.post("/getkyc", auth, KycCrudController.getAllKyc);
routes.get("/getkycbyUserId/:id", auth, KycCrudController.getKycByUserId);
module.exports = routes;
