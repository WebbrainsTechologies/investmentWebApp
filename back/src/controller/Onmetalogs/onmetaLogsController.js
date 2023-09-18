const responseHandler = require("../../handler/responsehandler");
const MessageConstant = require("../../constant/messageconstant");
const OnmetalogsService = require("../../service/Onmetalogs/onmetalogsService");
class Onmetalogscontroller {
  constructor() {}

  //   add onmeta logs
  async addOnmetaLogs(req, res) {
    try {
      const detail = await OnmetalogsService.addOnmetaLogs(
        req.body,
        req.user?._id,
        res
      );

      if (!detail) {
        return responseHandler.errorResponse(
          res,
          400,
          MessageConstant.SOMETHING_WRONG,
          []
        );
      }

      if (detail) {
        return responseHandler.successResponse(res, 200, "", detail);
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}

module.exports = new Onmetalogscontroller();
