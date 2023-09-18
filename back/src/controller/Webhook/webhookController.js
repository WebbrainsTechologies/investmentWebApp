const Messageconstant = require("../../constant/messageconstant");
const responseHandler = require("../../handler/responsehandler");
const WebhookService = require("../../service/Webhook/webhookService");
class WebhookController {
  constructor() {}
  // get user transection with pagination
  async getOnrampWebhook(req, res) {
    try {
      // console.log(req.body, "checkdata10");
      let details = await WebhookService.getOnrampWebhook(req.body, res);

      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async getOfframpWebhook(req, res) {
    try {
      // console.log(req.body, "checkdata11");
      let details = await WebhookService.getOfframpWebhook(req.body, res);

      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }

  async getKycWebhook(req, res) {
    try {
      // console.log(req.body, "checkdata12");
      let details = await WebhookService.getKycWebhook(req.body, res);

      return responseHandler.successResponse(res, 200, "", details);
    } catch (error) {
      responseHandler.errorResponse(res, 400, error.message, []);
    }
  }
}
module.exports = new WebhookController();
