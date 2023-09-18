const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const WithdrawalService = require("../../service/Withdrawal/withdrawalService");
class UserSubscriptionController {
  constructor() {}
  // add withdrawal request
  async AddWithdrawRequest(req, res) {
    try {
      const Detail = await WithdrawalService.AddWithdrawRequest(
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
      if (
        Detail ===
        "insufficient balance/your earlier withdrawal request under approval."
      ) {
        return responseHandler.errorResponse(
          res,
          400,
          "Insufficient balance/your earlier withdrawal request under approval.",
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.USER_WITHDRAWAL_ADD,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // change withdrawal request status
  async changeWithdrawalRequestStatus(req, res) {
    try {
      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter withdrawal request status.");

      // req
      //   .checkBody("notificationId")
      //   .notEmpty()
      //   .withMessage("Please enter notification Id");

      //   req.checkBody("userId").notEmpty().withMessage("Please enter userId");

      const errors = req.validationErrors();
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }

      const filename = req.file ? req.file?.filename : "";
      const Detail = await WithdrawalService.changeWithdrawalRequestStatus(
        req.params.id,
        req.body,
        filename,
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

  // get all withdrawal request for admin with pagination
  async getallWithdrawalRequest(req, res) {
    try {
      let details = await WithdrawalService.getallWithdrawalRequest(
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
  // get all withdrawal request for user with pagination
  async getallWithdrawalRequestForUser(req, res) {
    try {
      let details = await WithdrawalService.getallWithdrawalRequestForUser(
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

  // check pending withdrawal amount
  async checkPendingWithdrawal(req, res) {
    try {
      let details = await WithdrawalService.checkPendingWithdrawal(
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
      if (
        details ===
        "insufficient balance/your earlier withdrawal request under approval."
      ) {
        return responseHandler.errorResponse(
          res,
          400,
          "Insufficient balance/your earlier withdrawal request under approval.",
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
