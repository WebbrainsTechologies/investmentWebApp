const responseHandler = require("../../handler/responsehandler");
const MessageConstant = require("../../constant/messageconstant");
const User = require("../../modal/User/user");
const UserHelper = require("../../helper/userhelper");
const bcrypt = require("bcryptjs");
const userAdminAuthservices = require("../../service/SuperAdmin/adminAndUserAuthServices");
const moment = require("moment");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const adminProfileService = require("../../service/SuperAdmin/adminProfileServices");
const userProfileService = require("../../service/User/userProfileServices");

class UserAdminAuthController {
  constructor() {}

  async superadminlogin(req, res) {
    try {
      const userDetail = await userAdminAuthservices.superadminlogin(
        req.body,
        res
      );
      if (!userDetail) {
        responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      responseHandler.successResponse(
        res,
        200,
        MessageConstant.OTP_SEND_SUCCESS,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  async superadminforgetpassword(req, res) {
    try {
      const userDetail = await userAdminAuthservices.forgetPassword(
        req.body,
        res
      );
      if (!userDetail) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.INVALID_EMAIL,
          []
        );
      }
      // console.log(userDetail, "userDetail");
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.LINK_SEND_SUCCESSFULLY
      );
    } catch (error) {
      return responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  async resetpassword(req, res) {
    try {
      if (!req.body.reset_token) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.invalid_request,
          []
        );
      }
      const user = await User.findOne({
        "reset_tokens.reset_password_token.token": req.body.reset_token,
      });
      if (!user) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.invalid_request,
          []
        );
      }
      if (moment.now() > user.reset_tokens.reset_password_token.expiry) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.reset_password_request_expired,
          []
        );
      }
      const userDetail = await userAdminAuthservices.resetpassword(
        req.body,
        user
      );

      if (!userDetail) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.PASSWORD_RESET_SUCCESS,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async superadminlogout(req, res) {
    try {
      const AdminDetails = req.user;
      const userDetail = await userAdminAuthservices.superadminlogout(
        AdminDetails
      );
      if (!userDetail) {
        responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      responseHandler.successResponse(
        res,
        200,
        MessageConstant.LOGIN_SUCCESS,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async change_password(req, res) {
    try {
      const admin_details = req.user;
      const comparePassword = await UserHelper.comparePassword(
        req.body.current_password,
        admin_details.password
      );

      if (!comparePassword) {
        return responseHandler.errorResponse(
          res,
          200,
          MessageConstant.wrong_current_password,
          {}
        );
        // throw new Error(MessageConstant.wrong_current_password);
      }
      if (req.body.new_password != req.body.confirm_new_password) {
        throw new Error(MessageConstant.password_change_missmatch);
      }
      const password_salt = await bcrypt.genSaltSync(
        Number(process.env.SALT_ROUNDS)
      );
      const hash_password = await bcrypt.hashSync(
        req.body.new_password,
        password_salt
      );
      await User.find({ _id: admin_details._id }).update({
        password: hash_password,
      });
      responseHandler.successResponse(
        res,
        200,
        MessageConstant.password_changed,
        {}
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async check(req, res) {
    if (req.user) {
      var token = req.user.token;
      var isReffral = false;
      if (req.user?.is_superadmin) {
        req.user = await adminProfileService.getViewAdmin(req.user._id);
      } else {
        req.user = await userProfileService.getViewUser(req.user._id);
        // console.log(req.user, "check190");
        let referral_user_id = req.user?._id;
        const userReffaralData = await User.findOne({
          referral_user_id: referral_user_id,
        });
        if (userReffaralData && Object.keys(userReffaralData)?.length > 0) {
          isReffral = true;
        }
      }
      let data = { ...req.user._doc, token: token, isReffral: isReffral };
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.SUCCESS,
        data
      );
    } else {
      responseHandler.errorResponse(res, 400, MessageConstant.LOGIN_FAIL, []);
    }
  }
}

module.exports = new UserAdminAuthController();
