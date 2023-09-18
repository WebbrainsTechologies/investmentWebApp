require("dotenv").config();
const mongoose = require("mongoose");
// mongoose.set("debug", true);
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
});
mongoose.Promise = global.Promise;

mongoose.connection
  .on("connected", () => {
    console.log("Database connected");
    // console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err}`);
  });
const app = require("./app");
const express = require("express");
var remote = express();
remote.use(function (req, res, next) {
  res.end("end");
});

const server = app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
// server.on("connection", function (socket) {
//     socket.on("data", function (chunk) {
//         // console.log(chunk.toString());
//     });
// });
