const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const InvoiceController = require("../../controller/Invoice/invoiceController");

routes.post("/getinvoiceData", auth, InvoiceController.getInvoice);
routes.post("/getinvoiceDatabyuser", auth, InvoiceController.getInvoiceByUser);

module.exports = routes;
