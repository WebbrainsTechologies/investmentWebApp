const express = require("express");
const app = express();
const myteamapi = require("./Myteam");

app.use("/myteamapi", myteamapi);

module.exports = app;
