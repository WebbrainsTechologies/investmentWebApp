const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const SubscriptionCrudServices = require("../../service/Subscription/subsctiptionCrudService");
class SubscriptionCrudController {
  constructor() {}
  // add subscription
  async addSubscription(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter subscription name.");

      req
        .checkBody("currency")
        .notEmpty()
        .withMessage("Please enter currency.");

      req
        .checkBody("amount")
        .notEmpty()
        .withMessage("Please enter amount.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      // req
      //   .checkBody("multiply_value")
      //   .notEmpty()
      //   .withMessage("Please enter value.")
      //   .matches(/^\d+(\.\d+)?$/)
      //   .withMessage("Please enter valid number");

      req
        .checkBody("duration")
        .notEmpty()
        .withMessage("Please enter subscription duration.");

      req
        .checkBody("roi")
        .notEmpty()
        .withMessage("Please enter roi.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      req
        .checkBody("roi_duration")
        .notEmpty()
        .withMessage("Please enter subscription duration.");

      req
        .checkBody("principal_withdrawal")
        .notEmpty()
        .withMessage("Please enter principal withdrawal.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      req
        .checkBody("commision_method")
        .notEmpty()
        .withMessage("Please enter subscription description.");

      req
        .checkBody("commision")
        .notEmpty()
        .withMessage("Please enter commision.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      req
        .checkBody("minimum_value")
        .notEmpty()
        .withMessage("Please enter minimum value.")
        .matches(/^[1-9]\d*$/)
        .withMessage("Please enter valid minimum value");

      // req
      //   .checkBody("description")
      //   .notEmpty()
      //   .withMessage("Please enter subscription description.");

      // req
      //   .checkBody("maximum_value")
      //   .notEmpty()
      //   .withMessage("Please enter maximum value.")
      //   .matches(/^\d+(\.\d+)?$/)
      //   .withMessage("Please enter valid number");

      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter subscription status.");

      const errors = req.validationErrors();
      console.log(errors, "checkerrors");
      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      const Detail = await SubscriptionCrudServices.addSubscription(
        req.body,
        res
      );

      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SUBSCRIPTION_PACKAGE_NAME_ALREADY_EXIST,
          []
        );
      }

      if (Detail) {
        return responseHandler.successResponse(
          res,
          200,
          Messageconstant.SUBSCRIPTION_PACKAGE_ADD,
          Detail
        );
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // edit subscription
  async editSubscription(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter subscription name.");

      req
        .checkBody("currency")
        .notEmpty()
        .withMessage("Please enter currency.");

      req
        .checkBody("amount")
        .notEmpty()
        .withMessage("Please enter amount.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      // req
      //   .checkBody("multiply_value")
      //   .notEmpty()
      //   .withMessage("Please enter value.")
      //   .matches(/^\d+(\.\d+)?$/)
      //   .withMessage("Please enter valid number");

      req
        .checkBody("duration")
        .notEmpty()
        .withMessage("Please enter subscription duration.");

      req
        .checkBody("roi")
        .notEmpty()
        .withMessage("Please enter roi.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      req
        .checkBody("roi_duration")
        .notEmpty()
        .withMessage("Please enter subscription duration.");

      req
        .checkBody("principal_withdrawal")
        .notEmpty()
        .withMessage("Please enter principal withdrawal.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      req
        .checkBody("commision_method")
        .notEmpty()
        .withMessage("Please enter subscription description.");

      req
        .checkBody("commision")
        .notEmpty()
        .withMessage("Please enter commision.")
        .matches(/^\d+(\.\d+)?$/)
        .withMessage("Please enter valid number");

      // req
      //   .checkBody("description")
      //   .notEmpty()
      //   .withMessage("Please enter subscription description.");

      // req
      //   .checkBody("maximum_value")
      //   .notEmpty()
      //   .withMessage("Please enter maximum value.")
      //   .matches(/^\d+(\.\d+)?$/)
      //   .withMessage("Please enter valid number");

      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter subscription status.");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      const Detail = await SubscriptionCrudServices.editSubscription(
        req.params.id,
        req.body,
        res
      );

      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SUBSCRIPTION_PACKAGE_NAME_ALREADY_EXIST,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.SUBSCRIPTION_PACKAGE_UPDATE,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // delete subscription
  async deleteSubscription(req, res) {
    try {
      const Detail = await SubscriptionCrudServices.deleteSubscription(
        req.params.id,
        res
      );
      if (Detail === "subscription already purchased") {
        return responseHandler.errorResponse(
          res,
          400,
          "Subscription Purchased",
          []
        );
      }
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
        Messageconstant.SUBSCRIPTION_PACKAGE_DELETE,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new SubscriptionCrudController();
