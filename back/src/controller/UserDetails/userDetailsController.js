const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const userDetailsServices = require("../../service/UserDetails/userDetailsServices");
const UserDetailService = require("../../service/UserDetails/userDetailsServices");
class UserDetailController {
  constructor() {}

  // get user detail data for total investment
  async getUserDetailsForTotalInvestment(req, res) {
    try {
      req.checkBody("userId").notEmpty().withMessage("Plese enter user Id");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await UserDetailService.getUserDetailsForTotalInvestment(
        req.params.id,
        req.body,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user detail data for total asset
  async getUserDetailsForTotalAsset(req, res) {
    try {
      req.checkBody("userId").notEmpty().withMessage("Plese enter user Id");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await UserDetailService.getUserDetailsForTotalAsset(
        req.params.id,
        req.body,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user detail data for total withdrawal
  async getUserDetailsForTotalWithdrawal(req, res) {
    try {
      req.checkBody("userId").notEmpty().withMessage("Plese enter user Id");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await UserDetailService.getUserDetailsForTotalWithdrawal(
        req.params.id,
        req.body,
        res
      );
      // console.log(details, "checkdetails");
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user detail data for roi and commision
  async getUserDetailsForRoiAndCommision(req, res) {
    try {
      req.checkBody("userId").notEmpty().withMessage("Plese enter user Id");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await UserDetailService.getUserDetailsForRoiAndCommision(
        req.params.id,
        req.body,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user detail data for wallet amount
  async getUserDetailsForWalletAmount(req, res) {
    try {
      req.checkBody("userId").notEmpty().withMessage("Plese enter user Id");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await UserDetailService.getUserDetailsForWalletAmount(
        req.params.id,
        req.body,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user approved subsctiption without pagination by userid
  async getUserApproveSubscriptionWithoutPagination(req, res) {
    try {
      let details =
        await UserDetailService.getUserApproveSubscriptionWithoutPagination(
          req.params.id,
          res
        );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get user future payout with pagination by user id
  async getUserFuturePayout(req, res) {
    try {
      // req.checkBody("year").notEmpty().withMessage("Please enter year value");
      req
        .checkBody("createdAt")
        .notEmpty()
        .withMessage("Please enter subscription createdAt value");

      // console.log(req.validationErrors(), "check176");
      const errors = req.validationErrors();
      if (errors) {
        // imageUnlinkSync(req.file?.filename);
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      let details = await userDetailsServices.getUserFuturePayout(
        req.params.id,
        req.body,
        res
      );
      if (!details) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new UserDetailController();
