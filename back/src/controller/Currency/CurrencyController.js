const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const CurrencyServices = require("../../service/Currency/currencyService");
class CurrencyController {
  constructor() {}
  // get currency by id
  async getCurrencyById(req, res) {
    try {
      const Detail = await CurrencyServices.getCurrencyById(req.params.id, res);

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
  // getall currency
  async getallCurrency(req, res) {
    try {
      let details = await CurrencyServices.getallCurrency(req.body, res);
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
  // get all currency without pagination
  async getallCurrencywithoutpagination(req, res) {
    try {
      let details = await CurrencyServices.getallCurrencywithoutpagination(
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

module.exports = new CurrencyController();
