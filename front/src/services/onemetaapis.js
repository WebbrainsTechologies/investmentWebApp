import { handleError, handleResponse, api } from "./onMetaApiServices";

// for on ramp
export const onMetaUserLogin = data =>
  api()
    .post("/users/login", data)
    .then(handleResponse)
    .catch(handleError);

export const onMetaFetchquotation = data =>
  api()
    .post("/quote/buy", data)
    .then(handleResponse)
    .catch(handleError);

export const onMetaChoosePaymentMethod = data =>
  api()
    .get("/orders/currencies", data)
    .then(handleResponse)
    .catch(handleError);

export const createOrder = (token, data) =>
  api(token)
    .post("/orders/create", data)
    .then(handleResponse)
    .catch(handleError);

export const updateUtr = (token, data) =>
  api(token)
    .post("/orders/utr", data)
    .then(handleResponse)
    .catch(handleError);

export const featchOrderStatus = (token, data) =>
  api(token)
    .post("/orders/status", data)
    .then(handleResponse)
    .catch(handleError);

export const featchToken = () =>
  api()
    .get("/tokens")
    .then(handleResponse)
    .catch(handleError);

// for off ramp
export const offRampFatchQuatation = (token, data) =>
  api(token)
    .post("/quote/sell", data)
    .then(handleResponse)
    .catch(handleError);

export const offRampCreateOrder = (token, data) =>
  api(token)
    .post("/offramp/orders/create", data)
    .then(handleResponse)
    .catch(handleError);

export const offRampFeatchOrderStatus = (token, data) =>
  api(token)
    .post("/offramp/orders/status", data)
    .then(handleResponse)
    .catch(handleError);

export const offRampUpdateHash = (token, data) =>
  api(token)
    .post("/offramp/orders/txnhash", data)
    .then(handleResponse)
    .catch(handleError);

// for kyc

export const kycUpdate = data =>
  api()
    .post("/users/upload/kyc", data)
    .then(handleResponse)
    .catch(handleError);

export const linkbankaccount = (token, data) =>
  api(token)
    .post("/users/account-link", data)
    .then(handleResponse)
    .catch(handleError);

export const checkbankstatus = (token, id) =>
  api(token)
    .get(`/users/get-bank-status/${id}`)
    .then(handleResponse)
    .catch(handleError);
