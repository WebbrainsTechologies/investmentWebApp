const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const MyTeamServices = require("../../service/Myteam/myTeamService");
class MyTeamController {
  constructor() {}
  // get team data
  async getTeamData(req, res) {
    try {
      const Detail = await MyTeamServices.getTeamData(
        req.params.id,
        req.user,
        res
      );
      if (Detail) {
        return responseHandler.successResponse(res, 200, "", Detail);
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  // get sponsor data
  async getSponsorData(req, res) {
    try {
      const Detail = await MyTeamServices.getSponsorData(
        req.params.id,
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
      return responseHandler.successResponse(res, 200, "", Detail);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new MyTeamController();
