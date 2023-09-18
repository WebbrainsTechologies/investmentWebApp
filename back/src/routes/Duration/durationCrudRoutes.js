const express = require("express");
const app = express();
const auth = require("../../middleware/auth");
const routes = express.Router();
const DurationController = require("../../controller/Duration/durationCrudController");

routes.post("/addduration", auth, DurationController.addDuration);
routes.post("/editduration/:id", auth, DurationController.editDuration);
routes.delete("/deleteduration/:id", auth, DurationController.deleteDuration);

module.exports = routes;
