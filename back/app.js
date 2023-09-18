const express = require("express"); // call express
const app = express(); // define our app using express
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
var cors = require("cors");
require("dotenv").config();
const initialdbAdmin = require("./src/initialdb/Adminuser");
const http = require("http");
const path = require("path");
const routes = require("./src/routes");
const { CronCall } = require("./src/crone/cronejob");
const morgan = require("morgan");
const { DailyCronCall } = require("./src/crone/dailyCroneJob");
const generateInvoiceFolder = require("./src/initialdb/InvoiceFolder");
const { OneminuteCronCall } = require("./src/crone/oneminuteCroneJob");
app.use(expressValidator());

app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static(__dirname.replace("/src", "") + "/uploads"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, User-Agent, Accept-Encoding, Content-Length"
  );
  next();
});

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.BASE_URL_ADMIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("socket", socket);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
initialdbAdmin.createAdminuser();
generateInvoiceFolder();
app.use("/api", routes);
CronCall();
DailyCronCall();
OneminuteCronCall();
app.use("/", express.static(__dirname.replace("/src", "") + "/Public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname.replace("/src", ""), "Public/index.html"));
});

module.exports = app;
