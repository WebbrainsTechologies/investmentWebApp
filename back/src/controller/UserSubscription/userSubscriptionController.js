const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const SubscriptionService = require("../../service/UserSubscription/userSubscriptionService");
class UserSubscriptionController {
  constructor() {}
  // purchase subscription
  async purchaseSubscription(req, res) {
    try {
      // console.log(req.file, "Check9");
      const fileName = req.file ? req.file?.filename : "";
      const Detail = await SubscriptionService.purchaseSubscription(
        req.params.id,
        req.body,
        req.user,
        fileName,
        res
      );
      if (!Detail) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      if (Detail === "maxlimit reached") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.MAX_LIMIT_REACHED,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.USER_INVESTMENT_ADD,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // change subscription status
  async changeSubscriptionStatus(req, res) {
    try {
      req
        .checkBody("usersubscriptionstatus")
        .notEmpty()
        .withMessage("Please enter subscription status.");

      // req
      //   .checkBody("notificationId")
      //   .notEmpty()
      //   .withMessage("Please enter notification Id");

      req.checkBody("userId").notEmpty().withMessage("Please enter userId");

      const errors = req.validationErrors();
      // console.log(errors, "checkerrors", req.body);
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      const Detail = await SubscriptionService.changeSubscriptionStatus(
        req.params.id,
        req.body,
        res
      );

      if (!Detail) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.STATUS,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get all subsctiption with pagination
  async getallSubscription(req, res) {
    try {
      let details = await SubscriptionService.getallSubscription(req.body, res);
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
  // get user approved or rejected subsctiption with pagination
  async getUserApproveRejectSubscription(req, res) {
    try {
      let details = await SubscriptionService.getUserApproveRejectSubscription(
        req.body,
        req.user,
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

  // get user approved subsctiption without pagination
  async getUserApproveSubscriptionWithoutPagination(req, res) {
    try {
      let details =
        await SubscriptionService.getUserApproveSubscriptionWithoutPagination(
          req.user,
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

  // change withdrawal request
  async changeWithdrawalRequest(req, res) {
    try {
      req
        .checkBody("withdrawal_request")
        .notEmpty()
        .withMessage("Please enter subscription withdrawal request.");

      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter subscription name.");

      const errors = req.validationErrors();
      // console.log(errors, "checkerrors", req.body);
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      const Detail = await SubscriptionService.changeWithdrawalRequest(
        req.params.id,
        req.body,
        req.user,
        res
      );

      if (!Detail) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.STATUS,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // change withdrawal request by admin
  async changeWithdrawalRequestByAdmin(req, res) {
    try {
      req
        .checkBody("withdrawal_status")
        .notEmpty()
        .withMessage("Please enter subscription withdrawal request.");

      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter subscription name.");

      req.checkBody("userId").notEmpty().withMessage("Please enter userid");

      const errors = req.validationErrors();
      // console.log(errors, "checkerrors", req.body);
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      const Detail = await SubscriptionService.changeWithdrawalRequestByAdmin(
        req.params.id,
        req.body,
        req.user,
        res
      );

      if (!Detail) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.STATUS,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get all approved user subscription with pagination
  async getUserApprovedSubscription(req, res) {
    try {
      let details = await SubscriptionService.getUserApprovedSubscription(
        req.body,
        req.user,
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

  // get all user withdrawal request with pagination
  async getallWithdrawalRequest(req, res) {
    try {
      let details = await SubscriptionService.getallWithdrawalRequest(
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
module.exports = new UserSubscriptionController();
