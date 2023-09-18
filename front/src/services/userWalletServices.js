import { handleError, handleResponse, api } from "./apiServices";

export const getUserWalletData = (token, data) =>
  api(token)
    .post(`/api/userwallet/userWalletroutes/getalluserwalletData`, data)
    .then(handleResponse)
    .catch(handleError);
