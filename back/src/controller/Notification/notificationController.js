const responseHandler = require("../../handler/responsehandler");
const MessageConstant = require("../../constant/messageconstant");
const NotificationService = require("../../service/Notification/notificationServices");

class Notificationcontroller {
  constructor() { }
  async notificationByUserIddetails(req, res) {
    try {
      const detail = await NotificationService.notificationByUserIddetails(req.body, req.user?._id, res);

      if (!detail) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      if (detail) {
        return responseHandler.successResponse(res, 200, "", detail);
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  async markUserNotificationRead(req, res) {
    try {
      const result = await NotificationService.markUserNotificationRead(req);

      if (!result) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      responseHandler.successResponse(res, 200, MessageConstant.SUCCESS, result);
    } catch (e) {
      console.log(e);
      responseHandler.errorResponse(res, 400, MessageConstant.SOMETHING_WRONG, []);
    }
  }

  async markUserNotificationReadById(req, res) {
    try {
      const result = await NotificationService.markUserNotificationReadById(req);

      if (!result) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      responseHandler.successResponse(res, 200, MessageConstant.SUCCESS, result);
    } catch (e) {
      console.log(e);
      responseHandler.errorResponse(res, 400, MessageConstant.SOMETHING_WRONG, []);
    }
  }

  async deleteUserNotificationById(req, res) {
    try {
      const result = await NotificationService.deleteUserNotificationById(req);

      if (!result) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.NOTIFICATION_DELETE,
        result
      );
    } catch (e) {
      console.log(e);
      responseHandler.errorResponse(res, 400, MessageConstant.SOMETHING_WRONG, []);
    }
  }

  async unreadNotificationsCount(req, res) {
    try {
      const result = await NotificationService.unreadNotificationsCount(req);

      if (!result) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      responseHandler.successResponse(res, 200, MessageConstant.SUCCESS, result);
    } catch (e) {
      console.log(e);
      responseHandler.errorResponse(res, 400, MessageConstant.SOMETHING_WRONG, []);
    }
  }
}

module.exports = new Notificationcontroller();
