const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const FuturepayoutService = require("../../service/FuturePayment/futurePaymentService");
class FuturePaymentController {
  constructor() {}
  // get user future payout with pagination
  async getUserFuturePayout(req, res) {
    try {
      // req.checkBody("year").notEmpty().withMessage("Please enter year value");
      req
        .checkBody("createdAt")
        .notEmpty()
        .withMessage("Please enter subscription createdAt value");

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

      let details = await FuturepayoutService.getUserFuturePayout(
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

  // get user dashboard future payout without pagination
  async getUserDashboardFuturePayout(req, res) {
    try {
      let details = await FuturepayoutService.getUserDashboardFuturePayout(
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
module.exports = new FuturePaymentController();
