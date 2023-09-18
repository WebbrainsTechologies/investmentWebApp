const express = require("express");
const app = express();
const onmetalogsApi = require("./onmetaLogsRoutes");

app.use("/onmetalogs", onmetalogsApi);

module.exports = app;
