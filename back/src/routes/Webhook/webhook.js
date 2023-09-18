const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const WebhookController = require("../../controller/Webhook/webhookController");

routes.post("/getonramp", WebhookController.getOnrampWebhook);
routes.post("/getofframp", WebhookController.getOfframpWebhook);
// routes.post("/getkyc",WebhookController.getOfframpWebhook);

module.exports = routes;
