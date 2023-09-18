import { handleError, handleResponse, api } from "./apiServices";

export const getKycByUserId = (token, id) =>
  api(token)
    .get(`/api/kyc/kyccrud/getkycbyUserId/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getAllKyc = (token, data) =>
  api(token)
    .post(`/api/kyc/kyccrud/getkyc`, data)
    .then(handleResponse)
    .catch(handleError);

export const addKyc = (token, id, data) =>
  api(token)
    .post(`/api/kyc/kyccrud/addkyc/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const editKyc = (token, id, data) =>
  api(token)
    .post(`/api/kyc/kyccrud/editkyc/${id}`, data)
    .then(handleResponse)
    .catch(handleError);
