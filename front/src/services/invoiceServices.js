import { api, handleResponse, handleError } from "./apiServices";

export const getInvoiceList = (token, data) =>
  api(token)
    .post(`/api/invoiceapi/invoiceRoutes/getinvoiceData`, data)
    .then(handleResponse)
    .catch(handleError);

export const getInvoiceListByUser = (token, data) =>
  api(token)
    .post(`/api/invoiceapi/invoiceRoutes/getinvoiceDatabyuser`, data)
    .then(handleResponse)
    .catch(handleError);
