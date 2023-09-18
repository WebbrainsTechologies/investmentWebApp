const OnmetalogsSchema = require("../../modal/Onmetalogs/onmetalogs");
const ObjectId = require("mongodb").ObjectId;

class OnmetalogsService {
  constructor() {}
  // add onemta logs
  async addOnmetaLogs(payload, res) {
    try {
      let data = await OnmetalogsSchema.create({
        url: payload.url,
        response: payload.response,
        request: payload.request,
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new OnmetalogsService();
