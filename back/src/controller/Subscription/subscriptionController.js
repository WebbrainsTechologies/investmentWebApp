const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const SubscriptionService = require("../../service/Subscription/subscriptionService");
class SubscriptionController {
  constructor() {}
  // change subscription status
  async changeSubscriptionStatus(req, res) {
    try {
      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter subscription status.");

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

  // get subscription by id
  async getSubscriptionById(req, res) {
    try {
      const Detail = await SubscriptionService.getSubscriptionById(
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
      return responseHandler.successResponse(res, 200, "", Detail);
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
  // get all subscription without pagination
  async getallSubscriptionWithOutPagination(req, res) {
    try {
      let details =
        await SubscriptionService.getallSubscriptionWithOutPagination(
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

  // get all subscription without pagination for subscriberpage
  async getallSubscriptionWithOutPaginationForSubscriberPage(req, res) {
    try {
      let details =
        await SubscriptionService.getallSubscriptionWithOutPaginationForSubscriberPage(
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
module.exports = new SubscriptionController();
