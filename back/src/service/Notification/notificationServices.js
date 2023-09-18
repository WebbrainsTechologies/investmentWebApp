const responseHandler = require("../../handler/responsehandler");
const notification = require("../../modal/Notification/notification");
const ObjectId = require("mongodb").ObjectId;

class Notificationservice {
  constructor() {}

  async notificationByUserIddetails(input, id, res) {
    try {
      let data;
      let userId = new ObjectId(id);
      if (input.page) {
        let options = {
          page: input.page,
          limit: input.limit,
          sort: { createdAt: -1 },
        };
        let query = { userId: userId };
        data = await notification.paginate(query, options);
      } else {
        data = await notification
          .find({ userId: userId, seen: false })
          .sort({ createdAt: -1 });
      }

      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  async markUserNotificationRead(req) {
    try {
      let userId = new ObjectId(req.user.id);
      let data = await notification.updateMany(
        { user_id: userId },
        { seen: true }
      );

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async markUserNotificationReadById(req) {
    try {
      // console.log("req.params.id", req.params.id);
      let data = await notification.updateOne(
        { _id: req.params.id },
        { seen: true }
      );

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async deleteUserNotificationById(req) {
    try {
      let data = await notification.deleteOne({ _id: req.params.id });

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async unreadNotificationsCount(req) {
    try {
      let userId = new ObjectId(req.user._id);
      let query = {
        userId: userId,
        seen: false,
      };
      let unread_notifications = await notification.countDocuments(query);

      let data = {
        unread_notifications: unread_notifications,
      };
      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

module.exports = new Notificationservice();
