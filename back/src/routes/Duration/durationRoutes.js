const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const DurationController = require("../../controller/Duration/durationController");

routes.post("/getallduration", auth, DurationController.getallDuration);
routes.get(
  "/getalldurationwithoutpagination",
  auth,
  DurationController.getallDurationwithoutpagination
);
routes.post(
  "/changedurationstatus/:id",
  auth,
  DurationController.changeDurationStatus
);

module.exports = routes;
