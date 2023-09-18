const responseHandler = require("../../handler/responsehandler");
const userProfileService = require("../../service/User/userProfileServices");
const MessageConstant = require("../../constant/messageconstant");
const _ = require("lodash");
const userSubscription = require("../../modal/UserSubscription/userSubscription");
const User = require("../../modal/User/user");
const messages = require("../../helper/messages");
const UserHelper = require("../../helper/userhelper");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
class UserController {
  constructor() {}

  // new register user
  async userRegister(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter username.")
        .matches(/^[a-zA-Z][a-zA-Z ]*$/)
        .withMessage("Please enter a valid username.");
      // .isLength({ max: 20 })
      // .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("phone_number")
        .notEmpty()
        .withMessage("Please enter phone number.")
        .matches(/[0-9]/)
        .withMessage("Please enter a valid username.")
        .isLength({ max: 20 })
        .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      req
        .checkBody("password")
        .notEmpty()
        .withMessage("Please enter password.")
        .isLength({ min: 8, max: 16 })
        .withMessage("The password must be 8 to 16 characters in length.");

      // req.checkBody("is_admin").notEmpty();

      req.checkBody("is_superadmin").notEmpty();

      req.checkBody("user_status").notEmpty();
      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      const userDetail = await userProfileService.userRegister(req.body, res);

      if (userDetail === "Email Exist") {
        return responseHandler.errorResponse(
          res,
          400,
          "Email already exists. Please login",
          []
        );
      }
      // if (userDetail === "Phone Exist") {
      //   return responseHandler.errorResponse(
      //     res,
      //     400,
      //     MessageConstant.PHONE_ALREDY_EXIST,
      //     []
      //   );
      // }
      if (userDetail === "Invlid Referral code") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.INVALID_REFERRAL_CODE,
          userDetail
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.OTP_SEND_SUCCESS,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // new register user
  async userRegisterByAdmin(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter username.")
        .matches(/^[a-zA-Z][a-zA-Z ]*$/)
        .withMessage("Please enter a valid username.")
        .isLength({ max: 20 })
        .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("phone_number")
        .notEmpty()
        .withMessage("Please enter phone number.")
        .matches(/[0-9]/)
        .withMessage("Please enter a valid phone number.")
        .isLength({ max: 20 })
        .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      // req
      //   .checkBody("password")
      //   .notEmpty()
      //   .withMessage("Please enter password.")
      //   .isLength({ min: 8, max: 16 })
      //   .withMessage("The password must be 8 to 16 characters in length.");

      // req.checkBody("is_admin").notEmpty();

      req.checkBody("is_superadmin").notEmpty();

      req.checkBody("is_delete").notEmpty();

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      const userDetail = await userProfileService.userRegisterByAdmin(
        req.body,
        res
      );

      if (userDetail === "Email Exist") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.EMAIL_ALREDY_EXIST,
          []
        );
      }
      // if (userDetail === "Phone Exist") {
      //   return responseHandler.errorResponse(
      //     res,
      //     400,
      //     MessageConstant.PHONE_ALREDY_EXIST,
      //     []
      //   );
      // }
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.REGISTER_SUCCESS,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // update user by admin
  async updateUser(req, res) {
    try {
      // console.log(req.body.user_status, "check187");
      // if (!req.body?.user_status) {
      //   let subscriptionDetails = await userSubscription.find({
      //     userId: req.params?.id,
      //     usersubscriptionstatus: "Accepted",
      //   });
      //   if (subscriptionDetails?.length > 0) {
      //     return responseHandler.errorResponse(
      //       res,
      //       400,
      //       MessageConstant.USER_ALREADY_SUBSCRIBED,
      //       []
      //     );
      //   }
      // }

      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter username.")
        .matches(/^[a-zA-Z][a-zA-Z ]*$/)
        .withMessage("Please enter a valid username.")
        .isLength({ max: 20 })
        .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("phone_number")
        .notEmpty()
        .withMessage("Please enter phone number.")
        .matches(/[0-9]/)
        .withMessage("Please enter a valid username.")
        .isLength({ max: 10 })
        .withMessage("Username should not be more than 20 Characters.");

      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      req.checkBody("is_superadmin").notEmpty();

      req.checkBody("is_delete").notEmpty();

      const errors = req.validationErrors();
      // console.log(errors, "check234");
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      const userDetail = await userProfileService.updateUser(
        req.params.id,
        req.body,
        res
      );

      if (userDetail === "Email Exist") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.EMAIL_ALREDY_EXIST,
          []
        );
      }
      if (userDetail === "Phone Exist") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.PHONE_ALREDY_EXIST,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.UPDATE_USER_PROFILE,
        userDetail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user details
  async getViewUser(req, res) {
    try {
      const detail = await userProfileService.getViewUser(
        req.params.id,
        req.user,
        res
      );

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // update user status
  async updateuserstatus(req, res) {
    try {
      req
        .checkBody("is_delete")
        .notEmpty()
        .withMessage("Please enter user status");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      const detail = await userProfileService.updateuserstatus(
        req.params.id,
        req.body,
        res
      );
      if (detail === "subscription exist") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.USER_ALREADY_SUBSCRIBED,
          []
        );
      }
      responseHandler.successResponse(res, 200, MessageConstant.STATUS, detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // delete user
  async deleteUserProfile(req, res) {
    try {
      const detail = await userProfileService.deleteUserProfile(
        req.params.id,
        res
      );
      if (detail === "subscription exist") {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.USER_ALREADY_SUBSCRIBED,
          []
        );
      }

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.DELETE_USER_PROFILE,
        detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user details
  async getAllUser(req, res) {
    try {
      const detail = await userProfileService.getAllUser(req.body, res);

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get deleted user details
  async getDeletedUser(req, res) {
    try {
      const detail = await userProfileService.getDeletedUser(req.body, res);

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get users without pagination
  async getAllUserWithoutpagination(req, res) {
    try {
      const detail = await userProfileService.getAllUserWithoutpagination(
        req.body,
        res
      );

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user transaction detail
  async getUserTransactionDetails(req, res) {
    try {
      const detail = await userProfileService.getUserTransactionDetails(
        req.params.id,
        req.body,
        res
      );

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // update user details
  async updateUserProfile(req, res) {
    try {
      const admin_details = req.user;

      if (!admin_details) {
        if (req.file) {
          fs.unlinkSync(req.file?.path);
        }
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      if (!req.body?.logo && req.file) {
        if (req.file === undefined) {
          return responseHandler.errorResponse(
            res,
            400,
            MessageConstant.LOGO_MSG,
            errors
          );
        }
      }

      let filename = (await req.file) ? req.file?.filename : req.body.logo;

      await User.find({ _id: admin_details._id }).update({
        ...req.body,
        file: filename,
      });

      let updated_user = await User.find({ _id: admin_details._id });

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.UPDATE_USER_PROFILE,
        updated_user
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // resend otp
  async resendOtp(req, res) {
    try {
      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      const detail = await userProfileService.resendOtp(req.body, res);

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.OTP_SEND_SUCCESS,
        ""
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // send otp
  async sendOtp(req, res) {
    try {
      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      const detail = await userProfileService.sendOtp(req.body, res);

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.OTP_SEND_SUCCESS,
        ""
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // check otp
  async checkOtp(req, res) {
    try {
      req
        .checkBody("email")
        .notEmpty()
        .withMessage("Please enter email.")
        .isEmail()
        .withMessage("The email you have entered is invalid")
        .isLength({ max: 60 })
        .withMessage("Email id should not be more than 60 Characters.");

      req
        .checkBody("otp")
        .notEmpty()
        .withMessage("Please enter otp.")
        .isLength({ max: 4 })
        .withMessage("Otp should not be more than 4 Characters.");

      req
        .checkBody("page")
        .notEmpty()
        .withMessage("Please enter path from where you came");

      const errors = req.validationErrors();
      // console.log(errors, "checkerrors");
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      const detail = await userProfileService.checkOtp(req.body, res);
      if (!detail) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.INVALID_OTP,
          ""
        );
      }
      responseHandler.successResponse(
        res,
        200,
        req.body?.page === "Sign Up"
          ? MessageConstant.REGISTER_SUCCESS
          : req.body?.page === "Sign In"
          ? MessageConstant.LOGIN_SUCCESS
          : MessageConstant.OTP_VERIFIED_SUCCESS,
        detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}

module.exports = new UserController();
