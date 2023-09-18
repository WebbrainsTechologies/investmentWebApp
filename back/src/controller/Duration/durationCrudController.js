const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const DurationCrudServices = require("../../service/Duration/durationCrudService");
class DurationCrudController {
  constructor() {}
  // add Duration
  async addDuration(req, res) {
    try {
      req
        .checkBody("month")
        .notEmpty()
        .withMessage("Please enter duration month.");

      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter duration status.");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      const Detail = await DurationCrudServices.addDuration(req.body, res);

      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.DURATION_EXIST,
          []
        );
      }

      if (Detail) {
        return responseHandler.successResponse(
          res,
          200,
          Messageconstant.DURATION_ADD,
          Detail
        );
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // edit Duration
  async editDuration(req, res) {
    try {
      req
        .checkBody("month")
        .notEmpty()
        .withMessage("Please enter duration month.");

      req
        .checkBody("status")
        .notEmpty()
        .withMessage("Please enter duration status.");

      const errors = req.validationErrors();

      if (errors) {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      const Detail = await DurationCrudServices.editDuration(
        req.params.id,
        req.body,
        res
      );

      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.DURATION_EXIST,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.DURATION_UPDATED,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // delete Duration
  async deleteDuration(req, res) {
    try {
      const Detail = await DurationCrudServices.deleteDuration(
        req.params.id,
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
        Messageconstant.DURATION_DELETE,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new DurationCrudController();
