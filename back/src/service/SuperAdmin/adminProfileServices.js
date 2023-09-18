// const UserDao = require("../dao/userdao");
// const MessageConstant = require("../constant/messageconstant");
// const Userhelper = require("../helper/userhelper");
// const utility = require("../lib/utility");
// const bcrypt = require("bcryptjs");
// const forgetpswHtmlString = require("../emailer/forgetpassword");
require("dotenv").config();
const emailHandler = require("../../handler/emailhandler");
const crypto = require("crypto");
const User = require("../../modal/User/user");
const moment = require("moment");
const responseHandler = require("../../handler/responsehandler");
// const messages = require("../helper/messages");

class UserService {
  constructor() {}

  async getAlldetails(search, req, res) {
    try {
      let data = await User.find({
        is_admin: true,
        is_delete: false,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          {
            phone_number: { $regex: search, $options: "i" },
          },
        ],
      });

      return data;
    } catch (error) {
      // console.log(error);
      // return responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  async updateUserStatus(status, id, res) {
    try {
      let data = await User.findByIdAndUpdate(
        { _id: id },
        {
          user_status: status,
        }
      );

      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  // getAlldetails
  async getViewAdmin(_id, res) {
    try {
      let data = await User.findById({ _id });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }

  async updateAdminDetails(_id, payload, res) {
    try {
      let data = await User.findByIdAndUpdate({ _id }, payload);

      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // deleteAdminProfile
  async deleteAdminProfile(_id, res) {
    try {
      // console.log(_id);
      let data = await User.findByIdAndUpdate({ _id }, { is_delete: true });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new UserService();
