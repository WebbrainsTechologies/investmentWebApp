const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const UserWalletService = require("../../service/UserWallet/userWalletService");
class UserWalletController {
  constructor() {}
  // get user transection with pagination
  async getUserTransaction(req, res) {
    try {
      let details = await UserWalletService.getUserTransaction(
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
      let details = await UserWalletService.getAdminTransaction(
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
module.exports = new UserWalletController();
