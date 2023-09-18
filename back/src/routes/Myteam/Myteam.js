const express = require("express");
const routes = express.Router();
const MyTeamController = require("../../controller/Myteam/myTeamController");
const auth = require("../../middleware/auth");

routes.get("/usermyteamData/:id", auth, MyTeamController.getTeamData);
routes.get("/getusersponsor/:id", auth, MyTeamController.getSponsorData);

module.exports = routes;
