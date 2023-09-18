const DurationSchema = require("../../modal/Duration/duration");
const responseHandler = require("../../handler/responsehandler");

class DurationService {
  constructor() {}
  // change Duration status
  async changeDurationStatus(_id, payload, res) {
    try {
      let data = await DurationSchema.findByIdAndUpdate(
        { _id },
        { status: payload.status }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // getall Duration
  async getallDuration(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let query = { is_delete: false };
      let data = await DurationSchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // getall Duration without pagination
  async getallDurationwithoutpagination(payload, res) {
    try {
      let data = await DurationSchema.find({
        is_delete: false,
        status: true,
      }).sort({
        month: 1,
      });
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new DurationService();
