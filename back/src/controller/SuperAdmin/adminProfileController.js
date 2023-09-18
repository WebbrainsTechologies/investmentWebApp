const responseHandler = require("../../handler/responsehandler");
const MessageConstant = require("../../constant/messageconstant");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const adminProfileService = require("../../service/SuperAdmin/adminProfileServices");
const User = require("../../modal/User/user");
const fs = require("fs");
const imageUnlinkSync = require("../../helper/imageRemoval");
class AdminProfileController {
  constructor() {}

  // get user details
  async getAdmin(req, res) {
    try {
      const detail = await adminProfileService.getAlldetails(
        req.body.search,
        req.user,
        res
      );

      return responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      return responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async updateUserStatus(req, res) {
    try {
      const detail = await adminProfileService.updateUserStatus(
        req.body.status,
        req.params.id,
        res
      );

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.USER_STATUS,
        detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // get user details
  async getAdminProfile(req, res) {
    try {
      const detail = await adminProfileService.getViewAdmin(req.params.id, res);

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async updateAdminProfile(req, res) {
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

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }
      const admin_details = req.body;

      if (!admin_details) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      const detail = await adminProfileService.updateAdminDetails(
        req.params.id,
        req.body,
        res
      );

      return responseHandler.successResponse(
        res,
        200,
        MessageConstant.UPDATE_USER_PROFILE,
        detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async deleteAdminProfile(req, res) {
    try {
      const detail = await adminProfileService.deleteAdminProfile(
        req.params.id,
        res
      );

      responseHandler.successResponse(res, 200, "", detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async update_admin_profile(req, res) {
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

      if (!req.body?.profile_img && req.file) {
        if (req.file === undefined) {
          return responseHandler.errorResponse(
            res,
            400,
            MessageConstant.LOGO_MSG,
            errors
          );
        }
      }

      let filename = (await req.file)
        ? req.file?.filename
        : req.body.profile_img;
      const data = await User.findById({ _id: admin_details._id });
      if (filename) {
        if (filename !== data.profile_img) {
          if (data.profile_img) {
            imageUnlinkSync(data.profile_img);
          }
        }
      }
      // console.log(req.body, "check161");
      await User.find({ _id: admin_details._id }).updateOne({
        ...req.body,
        profile_img: filename,
      });

      let updated_user = await User.find({ _id: admin_details._id });

      responseHandler.successResponse(
        res,
        200,
        MessageConstant.SUPERADMIN_UPDATE_PROFILE,
        updated_user
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async get_superadmin_profile(req, res) {
    try {
      // console.log(req.user, "check194");
      let isReffral = false;
      const userReffaralData = await User.findOne({
        referral_user_id: req.user?._id,
      });
      if (userReffaralData && Object.keys(userReffaralData)?.length > 0) {
        isReffral = true;
      }
      let admin_details = { ...req.user, isReffral: isReffral };

      responseHandler.successResponse(res, 200, "", admin_details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}

module.exports = new AdminProfileController();
