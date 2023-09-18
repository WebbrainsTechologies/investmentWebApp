import { api, handleResponse, handleError } from "./apiServices";

export const getUserFuturePayout = (token, params) =>
  api(token)
    .post(`/api/futurepayment/futurepaymentRoutes/getUserFuturPayout`, params)
    .then(handleResponse)
    .catch(handleError);

export const getDashboardUserFuturePayout = token =>
  api(token)
    .get(`/api/futurepayment/futurepaymentRoutes/getDashboardUserFuturePayout`)
    .then(handleResponse)
    .catch(handleError);
