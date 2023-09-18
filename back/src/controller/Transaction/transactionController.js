const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const TransactionService = require("../../service/Transaction/transactionService");
class UserTransactionController {
  constructor() {}
  // get user transection with pagination
  async getUserTransaction(req, res) {
    try {
      let details = await TransactionService.getUserTransaction(
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
  async getAdminTransaction(req, res) {
    try {
      let details = await TransactionService.getAdminTransaction(
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
  async getCommisionPayout(req, res) {
    try {
      let details = await TransactionService.getCommisionPayout(
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
}
module.exports = new UserTransactionController();
