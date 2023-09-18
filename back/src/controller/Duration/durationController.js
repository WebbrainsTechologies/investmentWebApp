const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const DurationServices = require("../../service/Duration/durationService");
class DurationController {
  constructor() { }
  // change duration status
  async changeDurationStatus(req, res) {
    try {

      const Detail = await DurationServices.changeDurationStatus(req.params.id, req.body, res);

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
      )
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // getall duration
  async getallDuration(req, res) {
    try {
      let details = await DurationServices.getallDuration(req.body, res)
      if (!details) {
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
        "",
        details
      )
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);

    }
  }
  // get all duration without pagination
  async getallDurationwithoutpagination(req, res) {
    try {
      let details = await DurationServices.getallDurationwithoutpagination(req.body, res)
      if (!details) {
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
        "",
        details
      )
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);

    }
  }
}

module.exports = new DurationController();