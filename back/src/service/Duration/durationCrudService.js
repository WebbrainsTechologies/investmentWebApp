const DurationSchema = require("../../modal/Duration/duration");
const responseHandler = require("../../handler/responsehandler");

class DurationService {
  constructor() {}
  // add Duration
  async addDuration(payload, res) {
    try {
      let durationData = await DurationSchema.find({
        month: payload.month,
        is_delete: false,
      });
      if (durationData.length > 0) {
        return "name exist";
      }
      let data = await DurationSchema.create({
        month: payload.month,
        status: payload.status,
      });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // edit Duration
  async editDuration(_id, payload, res) {
    try {
      let durationData = await DurationSchema.find({
        month: payload.month,
        is_delete: false,
        _id: { $ne: _id },
      });
      if (durationData.length > 0) {
        return "name exist";
      }
      let data = await DurationSchema.findByIdAndUpdate(
        { _id },
        {
          month: payload.month,
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // delete Duration
  async deleteDuration(_id, res) {
    try {
      let data = await DurationSchema.findByIdAndUpdate(
        { _id },
        {
          is_delete: true,
        }
      );
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new DurationService();
