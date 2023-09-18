const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const notificationController = require("../../controller/Notification/notificationController");

routes.post("/getadminusernotification",auth,notificationController.notificationByUserIddetails);
routes.post("/adminusernotification/mark/read",auth,notificationController.markUserNotificationRead);
routes.post("/adminusernotification/mark/read/:id",auth,notificationController.markUserNotificationReadById);
routes.delete("/adminusernotification/delete/:id",auth,notificationController.deleteUserNotificationById);
routes.get("/getadminusernotification/unread/count",auth,notificationController.unreadNotificationsCount);

module.exports = routes;