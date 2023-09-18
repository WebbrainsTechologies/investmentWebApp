const express = require("express");
const auth = require("../../middleware/auth");
const routes = express.Router();
const Onmetalogscontroller = require("../../controller/Onmetalogs/onmetaLogsController");

routes.post("/addonmetalogs", auth, Onmetalogscontroller.addOnmetaLogs);

module.exports = routes;
