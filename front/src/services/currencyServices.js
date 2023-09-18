import { handleError, handleResponse, api } from "./apiServices";

export const addCurrency = (token, data) =>
  api(token)
    .post("/api/currency/currencycrud/addcurrency", data)
    .then(handleResponse)
    .catch(handleError);

export const editCurrency = (token, id, data) =>
  api(token)
    .post(`/api/currency/currencycrud/editcurrency/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteCurrency = (token, id) =>
  api(token)
    .delete(`/api/currency/currencycrud/deletecurrency/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getCurrency = (token, data) =>
  api(token)
    .post("/api/currency/currency/getallcurrency", data)
    .then(handleResponse)
    .catch(handleError);

export const getCurrencyById = (token, id) =>
  api(token)
    .get(`/api/currency/currency/getcurrencybyid/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getallCurrency = (token, data) =>
  api(token)
    .get("/api/currency/currency/getallcurrencywithoutpagination", data)
    .then(handleResponse)
    .catch(handleError);
