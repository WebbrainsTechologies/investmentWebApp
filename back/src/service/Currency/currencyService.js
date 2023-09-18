const CurrencySchema = require("../../modal/Currency/currency");
const responseHandler = require("../../handler/responsehandler");

class CurrencyService {
  constructor() {}
  // get currency by id
  async getCurrencyById(_id, res) {
    try {
      let data = await CurrencySchema.findByIdAndUpdate({ _id });
      return data;
    } catch (error) {
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // getall currency
  async getallCurrency(payload, res) {
    try {
      let { page, limit, sort_on, sort } = payload;
      let options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { [sort_on]: sort === "asc" ? 1 : -1 },
      };
      let query = { is_delete: false };
      let data = await CurrencySchema.paginate(query, options);
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
  // getall currency without pagination
  async getallCurrencywithoutpagination(payload, res) {
    try {
      let data = await CurrencySchema.find({ is_delete: false });
      return data;
    } catch (error) {
      console.log(error, "60");
      // responseHandler.errorResponse(res, 400, error.message, []);
      throw new Error(error);
    }
  }
}

module.exports = new CurrencyService();
