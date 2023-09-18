const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const InvoiceService = require("../../service/Invoice/invoiceService");
class InvoiceController {
  constructor() {}
  // get invoice with pagination
  async getInvoice(req, res) {
    try {
      let details = await InvoiceService.getInvoice(req.body, req.user, res);
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
  // get invoice by user with pagination
  async getInvoiceByUser(req, res) {
    try {
      let details = await InvoiceService.getInvoiceByUser(
        req.body,
        req.user,
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
module.exports = new InvoiceController();
