const responseHandler = require("../../handler/responsehandler");
const Messageconstant = require("../../constant/messageconstant");
const CurrencyCrudServices = require("../../service/Currency/currencyCrudService");
const imageUnlinkSync = require("../../helper/imageRemoval");
class CurrencyCrudController {
  constructor() {}
  // add currency
  async addCurrency(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter currency name.");
      req
        .checkBody("onmeta_data")
        .notEmpty()
        .withMessage("Please enter select onmeta currency.");
      // req
      //   .checkBody("onmeta_name")
      //   .notEmpty()
      //   .withMessage("Please enter currency onmeta name.");
      // req
      //   .checkBody("symbol")
      //   .notEmpty()
      //   .withMessage("Please enter currency symbol.");
      // req
      //   .checkBody("chainId")
      //   .notEmpty()
      //   .withMessage("Please enter currency chainId.");
      // req
      //   .checkBody("decimals")
      //   .notEmpty()
      //   .withMessage("Please enter currency decimals.");

      // req
      //   .checkBody("multiply_value")
      //   .notEmpty()
      //   .withMessage("Please enter multiply value");

      const errors = req.validationErrors();
      if (errors) {
        imageUnlinkSync(req.file?.filename);

        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      // let filename = (await req.file) ? req.file?.filename : "";
      const Detail = await CurrencyCrudServices.addCurrency(
        req.body,
        // filename,
        res
      );
      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.CURRENCY_EXIST,
          []
        );
      }
      if (Detail) {
        return responseHandler.successResponse(
          res,
          200,
          Messageconstant.CURRENCY_ADD,
          Detail
        );
      }
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // edit currency
  async editCurrency(req, res) {
    try {
      req
        .checkBody("name")
        .notEmpty()
        .withMessage("Please enter currency name.");

      req
        .checkBody("onmeta_data")
        .notEmpty()
        .withMessage("Please enter select onmeta currency.");
      // req
      //   .checkBody("onmeta_name")
      //   .notEmpty()
      //   .withMessage("Please enter currency onmeta name.");
      // req
      //   .checkBody("symbol")
      //   .notEmpty()
      //   .withMessage("Please enter currency symbol.");
      // req
      //   .checkBody("chainId")
      //   .notEmpty()
      //   .withMessage("Please enter currency chainId.");
      // req
      //   .checkBody("decimals")
      //   .notEmpty()
      //   .withMessage("Please enter currency decimals.");

      // req
      //   .checkBody("multiply_value")
      //   .notEmpty()
      //   .withMessage("Please enter multiply value");

      const errors = req.validationErrors();

      if (errors) {
        imageUnlinkSync(req.file?.filename);

        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.SOMETHING_WRONG,
          []
        );
      }
      // let filename = (await req.file) ? req.file?.filename : "";

      const Detail = await CurrencyCrudServices.editCurrency(
        req.params.id,
        req.body,
        // filename,
        res
      );

      if (Detail === "name exist") {
        return responseHandler.errorResponse(
          res,
          400,
          Messageconstant.CURRENCY_EXIST,
          []
        );
      }
      return responseHandler.successResponse(
        res,
        200,
        Messageconstant.CURRENCY_UPDATED,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
  // delete currency
  async deleteCurrency(req, res) {
    try {
      const Detail = await CurrencyCrudServices.deleteCurrency(
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
        Messageconstant.CURRENCY_DELETE,
        Detail
      );
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new CurrencyCrudController();
